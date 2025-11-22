import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import fs from 'fs';
import path from 'path';
import { ethers } from 'ethers';

@Injectable()
export class BlockchainService {
  private readonly logger = new Logger(BlockchainService.name);
  private providerUrl: string;
  private privateKey: string | undefined;

  constructor() {
    // Prefer POLKADOT_RPC_URL, fallback to RPC_URL
    this.providerUrl = process.env.POLKADOT_RPC_URL || process.env.RPC_URL || 'https://rpc.testnet.moonbeam.network';
    const pk = process.env.PRIVATE_KEY || process.env.ARKIV_PRIVATE_KEY || '';
    // Normalize private key with 0x prefix if necessary
    if (pk && !pk.startsWith('0x') && pk.length === 64) {
      this.privateKey = `0x${pk}`;
    } else if (pk) {
      this.privateKey = pk;
    }
  }

  private getSigner(): ethers.Wallet {
    if (!this.privateKey) {
      throw new InternalServerErrorException('PRIVATE_KEY not configured for deployment');
    }
    const provider = new ethers.JsonRpcProvider(this.providerUrl);
    return new ethers.Wallet(this.privateKey, provider);
  }

  private loadArtifact(contractName: string) {
    // artifacts path: artifacts/contracts/<ContractName>.sol/<ContractName>.json
    const artifactsDir = path.resolve(process.cwd(), 'artifacts', 'contracts');
    // Find the folder that contains contractName
    const contractFolder = fs.readdirSync(artifactsDir).find((f) => f.includes(contractName));
    if (!contractFolder) {
      // try direct path
      const direct = path.resolve(artifactsDir, `${contractName}.sol`, `${contractName}.json`);
      if (fs.existsSync(direct)) return JSON.parse(fs.readFileSync(direct, 'utf8'));
      throw new Error(`Artifact folder for ${contractName} not found in artifacts/contracts`);
    }
    const artifactPath = path.resolve(artifactsDir, contractFolder, `${contractName}.json`);
    if (!fs.existsSync(artifactPath)) throw new Error(`Artifact not found: ${artifactPath}`);
    const raw = fs.readFileSync(artifactPath, 'utf8');
    return JSON.parse(raw);
  }

  async deployClubToken(clubName: string, tokenSymbol: string, initialSupplyWei?: string) {
    try {
      const signer = this.getSigner();
      const artifact = this.loadArtifact('ClubToken');
      const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, signer);

      const initialSupply = initialSupplyWei || ethers.parseEther('1000000').toString();

      this.logger.log(`Deploying ClubToken for ${clubName} (${tokenSymbol}) to ${this.providerUrl}`);
      const contract = await factory.deploy(clubName, tokenSymbol, initialSupply);
      await contract.waitForDeployment();

      const address = typeof contract.target === 'string' ? contract.target : contract.target.toString();
      this.logger.log(`ClubToken deployed at ${address}`);
      return { address, contract: contract as ethers.Contract };
    } catch (error) {
      this.logger.error('deployClubToken error', error as any);
      throw new InternalServerErrorException('Failed to deploy ClubToken');
    }
  }

  async deployPlayerNFT() {
    try {
      const signer = this.getSigner();
      const artifact = this.loadArtifact('PlayerNFT');
      const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, signer);

      this.logger.log(`Deploying PlayerNFT to ${this.providerUrl}`);
      const contract = await factory.deploy();
      await contract.waitForDeployment();

      const address = typeof contract.target === 'string' ? contract.target : contract.target.toString();
      this.logger.log(`PlayerNFT deployed at ${address}`);
      return { address, contract: contract as ethers.Contract };
    } catch (error) {
      this.logger.error('deployPlayerNFT error', error as any);
      throw new InternalServerErrorException('Failed to deploy PlayerNFT');
    }
  }

  async transferOwnership(contract: ethers.Contract, newOwner: string) {
    try {
      // Validate that newOwner is a valid Ethereum address
      if (!ethers.isAddress(newOwner)) {
        throw new Error(`Invalid address: ${newOwner}. Must be a valid Ethereum/EVM address starting with 0x`);
      }

      const contractAddress = typeof contract.target === 'string' ? contract.target : contract.target.toString();
      this.logger.log(`Transferring ownership of ${contractAddress} to ${newOwner}`);
      const tx = await contract.transferOwnership(newOwner);
      // wait for tx
      if (tx && tx.wait) await tx.wait();
      return tx?.hash || null;
    } catch (error) {
      this.logger.error('transferOwnership error', error as any);
      throw new InternalServerErrorException('Failed to transfer contract ownership');
    }
  }
}
