/**
 * Ejemplo de cómo usar Arkiv Network SDK
 * 
 * Este archivo muestra cómo:
 * - Crear un cliente de Arkiv
 * - Subir archivos como entities
 * - Agregar metadata con attributes
 * - Recuperar entities
 */

import { createWalletClient, createPublicClient } from '@arkiv-network/sdk';
import { http } from '@arkiv-network/sdk';
import { privateKeyToAccount } from '@arkiv-network/sdk/accounts';
import { mendoza } from '@arkiv-network/sdk/chains';
import { ExpirationTime, jsonToPayload } from '@arkiv-network/sdk/utils';
import { randomUUID } from 'crypto';

// ========================================
// 1. CREAR WALLET CLIENT (para escribir)
// ========================================

async function createArkivWalletClient(privateKey: string) {
  // Crear account desde private key
  const account = privateKeyToAccount(`0x${privateKey.replace('0x', '')}`);

  // Crear wallet client
  const client = createWalletClient({
    chain: mendoza,
    transport: http(),
    account,
  });

  return client;
}

// ========================================
// 2. CREAR PUBLIC CLIENT (para leer)
// ========================================

async function createArkivPublicClient() {
  const client = createPublicClient({
    chain: mendoza,
    transport: http(),
  });

  return client;
}

// ========================================
// 3. SUBIR ARCHIVO COMO ENTITY
// ========================================

async function uploadFile(
  client: any,
  fileBuffer: Buffer,
  metadata: {
    fileName: string;
    mimeType: string;
    userId: string;
  },
) {
  const entityId = randomUUID();

  // Crear entity con el archivo usando jsonToPayload
  const { entityKey, txHash } = await client.createEntity({
    payload: jsonToPayload({
      entity: {
        entityType: 'file',
        entityId,
        fileName: metadata.fileName,
        mimeType: metadata.mimeType,
        userId: metadata.userId,
        uploadedAt: Date.now(),
      },
      data: fileBuffer.toString('base64'), // Convert buffer to base64
    }),
    contentType: 'application/json',
    attributes: [
      { key: 'type', value: 'file' },
      { key: 'fileName', value: metadata.fileName },
      { key: 'mimeType', value: metadata.mimeType },
      { key: 'userId', value: metadata.userId },
    ],
    expiresIn: ExpirationTime.fromDays(30), // 30 days expiration
  });

  console.log('✅ File uploaded!');
  console.log('Entity Key:', entityKey);
  console.log('Transaction Hash:', txHash);

  return {
    entityKey,
    txHash,
  };
}

// ========================================
// 4. SUBIR CHUNK DE ARCHIVO
// ========================================

async function uploadChunk(
  client: any,
  chunkBuffer: Buffer,
  metadata: {
    fileName: string;
    mimeType: string;
    userId: string;
    chunkIndex: number;
    totalChunks: number;
  },
) {
  const { entityKey, txHash } = await client.createEntity({
    payload: jsonToPayload({
      entity: {
        entityType: 'file-chunk',
        fileName: metadata.fileName,
        mimeType: metadata.mimeType,
        userId: metadata.userId,
        chunkIndex: metadata.chunkIndex,
        totalChunks: metadata.totalChunks,
        uploadedAt: Date.now(),
      },
      data: chunkBuffer.toString('base64'),
    }),
    contentType: 'application/json',
    attributes: [
      { key: 'type', value: 'file-chunk' },
      { key: 'fileName', value: metadata.fileName },
      { key: 'chunkIndex', value: metadata.chunkIndex.toString() },
      { key: 'totalChunks', value: metadata.totalChunks.toString() },
    ],
    expiresIn: ExpirationTime.fromDays(30),
  });

  console.log(`✅ Chunk ${metadata.chunkIndex + 1}/${metadata.totalChunks} uploaded!`);
  console.log('Entity Key:', entityKey);

  return {
    entityKey,
    txHash,
  };
}

// ========================================
// 5. OBTENER ENTITY POR KEY
// ========================================

async function getEntity(publicClient: any, entityKey: string) {
  try {
    const entity = await publicClient.getEntity(entityKey);

    console.log('📄 Entity Details:');
    console.log('Key:', entity.key);
    console.log('Owner:', entity.owner);
    console.log('Expiration Block:', entity.expirationBlock);
    console.log('Attributes:', entity.attributes);

    // Parse payload if it's JSON
    if (entity.payload) {
      try {
        const payloadStr = Buffer.from(entity.payload).toString('utf-8');
        const payloadJson = JSON.parse(payloadStr);
        console.log('Payload:', payloadJson);

        // If there's base64 data, we can decode it
        if (payloadJson.data) {
          const fileBuffer = Buffer.from(payloadJson.data, 'base64');
          console.log('File size:', fileBuffer.length, 'bytes');
        }
      } catch (e) {
        console.log('Payload (raw):', entity.payload);
      }
    }

    return entity;
  } catch (error) {
    console.error('❌ Error getting entity:', error);
    throw error;
  }
}

// ========================================
// 6. BUSCAR ENTITIES (si está disponible)
// ========================================

// Note: Query functionality may depend on Arkiv SDK version
// Check documentation for current query capabilities

// ========================================
// 7. EXTENDER EXPIRACIÓN
// ========================================

async function extendEntityExpiration(
  client: any,
  entityKey: string,
  additionalDays: number,
) {
  try {
    const { txHash } = await client.extendEntity({
      entityKey,
      expiresIn: ExpirationTime.fromDays(additionalDays),
    });

    console.log('✅ Entity expiration extended!');
    console.log('Transaction Hash:', txHash);

    return { txHash };
  } catch (error) {
    console.error('❌ Error extending entity:', error);
    throw error;
  }
}

// ========================================
// 8. ELIMINAR ENTITY
// ========================================

async function deleteEntity(client: any, entityKey: string) {
  try {
    const { txHash } = await client.deleteEntity({
      entityKey,
    });

    console.log('✅ Entity deleted!');
    console.log('Transaction Hash:', txHash);

    return { txHash };
  } catch (error) {
    console.error('❌ Error deleting entity:', error);
    throw error;
  }
}

// ========================================
// EJEMPLO DE USO COMPLETO
// ========================================

async function main() {
  const PRIVATE_KEY = process.env.ARKIV_PRIVATE_KEY || '';

  if (!PRIVATE_KEY) {
    console.error('❌ ARKIV_PRIVATE_KEY not found in environment');
    process.exit(1);
  }

  try {
    // 1. Crear wallet client
    console.log('1️⃣  Creating Arkiv wallet client...');
    const walletClient = await createArkivWalletClient(PRIVATE_KEY);

    // 2. Subir un archivo de ejemplo
    console.log('\n2️⃣  Uploading file...');
    const fileData = Buffer.from('Hello Arkiv! This is a test file.');
    const uploadResult = await uploadFile(walletClient, fileData, {
      fileName: 'test.txt',
      mimeType: 'text/plain',
      userId: 'user-123',
    });

    // 3. Crear public client para leer
    console.log('\n3️⃣  Creating public client...');
    const publicClient = await createArkivPublicClient();

    // 4. Obtener la entity que acabamos de crear
    console.log('\n4️⃣  Fetching entity...');
    await getEntity(publicClient, uploadResult.entityKey);

    // 5. Ejemplo de chunking para archivos grandes
    console.log('\n5️⃣  Uploading large file in chunks...');
    const largeFile = Buffer.from('Large file content...'.repeat(1000));
    const CHUNK_SIZE = 1024 * 1024; // 1MB
    const totalChunks = Math.ceil(largeFile.length / CHUNK_SIZE);

    for (let i = 0; i < totalChunks; i++) {
      const start = i * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, largeFile.length);
      const chunk = largeFile.slice(start, end);

      await uploadChunk(walletClient, chunk, {
        fileName: 'large-file.dat',
        mimeType: 'application/octet-stream',
        userId: 'user-123',
        chunkIndex: i,
        totalChunks,
      });
    }

    // 6. Extender expiración (opcional)
    console.log('\n6️⃣  Extending entity expiration...');
    await extendEntityExpiration(walletClient, uploadResult.entityKey, 30); // +30 días más

    console.log('\n✅ All operations completed successfully!');
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

// Ejecutar ejemplo si se llama directamente
if (require.main === module) {
  main();
}

export {
  createArkivWalletClient,
  createArkivPublicClient,
  uploadFile,
  uploadChunk,
  getEntity,
  extendEntityExpiration,
  deleteEntity,
};
