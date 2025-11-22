import { Injectable } from '@nestjs/common';
import { Keyring } from '@polkadot/api';
import { mnemonicGenerate, mnemonicValidate, cryptoWaitReady } from '@polkadot/util-crypto';
import { ethers } from 'ethers';

export interface PolkadotWalletData {
  mnemonic: string;
  address: string;
  publicKey: string;
  encryptedJson: any;
  evmAddress?: string; // Dirección EVM derivada del mismo mnemonic
}

@Injectable()
export class PolkadotWalletService {
  /**
   * Crea una nueva wallet de Polkadot
   * @param passphrase Contraseña para cifrar el JSON de la wallet
   * @returns Datos de la wallet (mnemonic, address, publicKey, encryptedJson)
   */
  async createWallet(passphrase: string): Promise<PolkadotWalletData> {
    // 1) Asegurarse que las funciones criptográficas wasm están listas
    await cryptoWaitReady();

    // 2) Generar mnemónico (BIP39, 12 palabras por defecto)
    const mnemonic = mnemonicGenerate();
    if (!mnemonicValidate(mnemonic)) {
      throw new Error('Mnemonic inválido (algo raro pasó)');
    }

    // 3) Crear keyring (por defecto usa 'sr25519')
    const keyring = new Keyring({ type: 'sr25519' });

    // 4) Añadir la cuenta desde el mnemónico
    const pair = keyring.addFromUri(mnemonic);

    // 5) Datos que querrás guardar / mostrar
    const address = pair.address; // dirección SS58 (ej: 1...)
    const publicKey = Buffer.from(pair.publicKey).toString('hex');

    // 6) Exportar JSON cifrado (toJson), protegido con passphrase
    const encryptedJson = pair.toJson(passphrase);

    // 7) Generar dirección EVM compatible desde el mismo mnemonic
    // Esto permite usar la misma seed phrase en wallets EVM como MetaMask
    const evmWallet = ethers.Wallet.fromPhrase(mnemonic);
    const evmAddress = evmWallet.address;

    return {
      mnemonic,
      address,
      publicKey,
      encryptedJson,
      evmAddress, // Dirección EVM (0x...) compatible con Moonbeam/Moonbase
    };
  }

  /**
   * Restaura una wallet desde un mnemónico
   * @param mnemonic Frase de recuperación
   * @returns Address de la wallet
   */
  async restoreFromMnemonic(mnemonic: string): Promise<string> {
    await cryptoWaitReady();

    if (!mnemonicValidate(mnemonic)) {
      throw new Error('Mnemonic inválido');
    }

    const keyring = new Keyring({ type: 'sr25519' });
    const pair = keyring.addFromUri(mnemonic);

    return pair.address;
  }
}
