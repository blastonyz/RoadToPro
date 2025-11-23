/**
 * Ejemplo de integración con el frontend
 * Este archivo muestra cómo registrar un usuario y manejar la wallet de Polkadot
 */

interface RegisterResponse {
  user: {
    id: string;
    email: string;
    name: string;
    wallets: Array<{
      id: string;
      address: string;
      network: string;
      currency: string;
      provider: string;
      isDefault: boolean;
    }>;
  };
  accessToken: string;
  refreshToken: string;
  polkadotMnemonic?: string; // ⚠️ Solo se devuelve una vez en el registro
}

/**
 * Registrar un nuevo usuario
 * IMPORTANTE: Guardar el polkadotMnemonic de forma segura
 */
async function register(email: string, password: string, name: string): Promise<RegisterResponse> {
  const response = await fetch('http://localhost:3000/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, name }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error en el registro');
  }

  const data: RegisterResponse = await response.json();

  // ⚠️ IMPORTANTE: Mostrar el mnemónico al usuario y pedirle que lo guarde
  if (data.polkadotMnemonic) {
    console.log('🔐 Mnemónico de Polkadot (guarda esto en un lugar seguro):');
    console.log(data.polkadotMnemonic);

    // En producción, deberías:
    // 1. Mostrar un modal con el mnemónico
    // 2. Pedir al usuario que lo copie o descargue
    // 3. Confirmar que lo ha guardado antes de continuar
    // 4. NO almacenarlo en localStorage sin cifrar
  }

  return data;
}

/**
 * Ejemplo de UI para mostrar el mnemónico
 * Puedes usar esto en tu componente de React/Vue/Angular
 */
function showMnemonicModal(mnemonic: string) {
  // Pseudo-código para un modal
  const modal = `
    <div class="modal">
      <h2>⚠️ Guarda tu frase de recuperación</h2>
      <p>Esta es tu frase de recuperación de Polkadot. <strong>Guárdala en un lugar seguro.</strong></p>
      <p>⚠️ Esta frase solo se mostrará una vez. Si la pierdes, no podrás recuperar tu wallet.</p>
      
      <div class="mnemonic-box">
        ${mnemonic}
      </div>
      
      <button onclick="copyToClipboard('${mnemonic}')">📋 Copiar</button>
      <button onclick="downloadMnemonic('${mnemonic}')">💾 Descargar</button>
      
      <label>
        <input type="checkbox" id="confirm-saved" />
        He guardado mi frase de recuperación de forma segura
      </label>
      
      <button id="continue-btn" disabled>Continuar</button>
    </div>
  `;

  // Habilitar el botón solo si el usuario confirma
  document.getElementById('confirm-saved')?.addEventListener('change', (e) => {
    const continueBtn = document.getElementById('continue-btn') as HTMLButtonElement;
    continueBtn.disabled = !(e.target as HTMLInputElement).checked;
  });
}

/**
 * Copiar mnemónico al portapapeles
 */
function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    alert('✅ Mnemónico copiado al portapapeles');
  }).catch(err => {
    console.error('Error al copiar:', err);
  });
}

/**
 * Descargar mnemónico como archivo de texto
 */
function downloadMnemonic(mnemonic: string) {
  const blob = new Blob([
    `FRASE DE RECUPERACIÓN DE POLKADOT WALLET\n\n` +
    `⚠️ MANTÉN ESTA FRASE EN SECRETO ⚠️\n\n` +
    `${mnemonic}\n\n` +
    `Instrucciones:\n` +
    `1. Guarda este archivo en un lugar seguro\n` +
    `2. Nunca compartas esta frase con nadie\n` +
    `3. Puedes usar esta frase para recuperar tu wallet en Polkadot.js o cualquier wallet compatible\n`
  ], { type: 'text/plain' });

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'polkadot-recovery-phrase.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

/**
 * Login normal (devuelve los tokens pero NO el mnemónico)
 */
async function login(email: string, password: string) {
  const response = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error en el login');
  }

  return await response.json();
}

/**
 * Obtener las wallets del usuario
 */
async function getWallets(accessToken: string) {
  const response = await fetch('http://localhost:3000/auth/wallets', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener wallets');
  }

  return await response.json();
}

/**
 * Intentar recuperar información de la wallet de Polkadot
 * (Solo muestra un mensaje, el mnemónico ya no está disponible)
 */
async function getPolkadotRecovery(accessToken: string, password: string) {
  const response = await fetch('http://localhost:3000/auth/polkadot/recovery', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al obtener información de recuperación');
  }

  return await response.json();
}

// ======================
// EJEMPLO DE USO COMPLETO
// ======================

async function exampleUsage() {
  try {
    // 1. Registrar usuario
    console.log('1. Registrando usuario...');
    const registerData = await register(
      'user@example.com',
      'SecurePassword123!',
      'John Doe'
    );

    console.log('✅ Usuario registrado');
    console.log('Polkadot Address:', registerData.user.wallets[0].address);
    console.log('⚠️ Mnemónico (guárdalo):', registerData.polkadotMnemonic);

    // Guardar tokens
    const accessToken = registerData.accessToken;
    const refreshToken = registerData.refreshToken;

    // 2. Obtener wallets
    console.log('\n2. Obteniendo wallets...');
    const wallets = await getWallets(accessToken);
    console.log('Wallets:', wallets);

    // 3. Intentar recuperar mnemónico (no funciona después del registro)
    console.log('\n3. Intentando recuperar información...');
    const recovery = await getPolkadotRecovery(accessToken, 'SecurePassword123!');
    console.log('Info de recuperación:', recovery);

  } catch (error) {
    console.error('Error:', error);
  }
}

// Exportar funciones para usar en tu aplicación
export {
  register,
  login,
  getWallets,
  getPolkadotRecovery,
  showMnemonicModal,
  copyToClipboard,
  downloadMnemonic,
};
