/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Ejemplo de Cliente de Autenticación para Frontend
 * Este archivo muestra cómo interactuar con el backend desde una aplicación frontend
 */

// Configuración
const API_URL = 'http://localhost:3000/api';

// Interfaz de respuesta de autenticación
interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string | null;
    wallets: Array<{
      address: string;
      network: string;
      currency: string;
      isDefault: boolean;
    }>;
  };
}

// Interfaz de wallet
interface Wallet {
  id: string;
  address: string;
  network: string;
  currency: string;
  isDefault: boolean;
}

/**
 * Cliente de autenticación
 */
class AuthClient {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    // Recuperar tokens del localStorage si existen
    this.accessToken = localStorage.getItem('accessToken');
    this.refreshToken = localStorage.getItem('refreshToken');
  }

  /**
   * Registrar un nuevo usuario
   */
  async register(
    email: string,
    password: string,
    name?: string,
  ): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al registrar usuario');
    }

    const data: AuthResponse = await response.json();
    this.saveTokens(data.accessToken, data.refreshToken);
    return data;
  }

  /**
   * Login con email y contraseña
   */
  async loginWithEmail(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Credenciales inválidas');
    }

    const data: AuthResponse = await response.json();
    this.saveTokens(data.accessToken, data.refreshToken);
    return data;
  }

  /**
   * Iniciar login con wallet (envía OTP por email)
   */
  async initiateWalletLogin(walletAddress: string): Promise<boolean> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ walletAddress }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al enviar OTP');
    }

    const data = await response.json();
    return data.requiresOtp === true;
  }

  /**
   * Verificar código OTP y completar login con wallet
   */
  async verifyOtp(walletAddress: string, code: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ walletAddress, code }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Código OTP inválido');
    }

    const data: AuthResponse = await response.json();
    this.saveTokens(data.accessToken, data.refreshToken);
    return data;
  }

  /**
   * Vincular una wallet a la cuenta del usuario
   */
  async addWallet(
    address: string,
    network: string,
    currency: string,
    isDefault = false,
  ): Promise<Wallet> {
    const response = await fetch(`${API_URL}/auth/wallets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.accessToken}`,
      },
      body: JSON.stringify({ address, network, currency, isDefault }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al vincular wallet');
    }

    return response.json();
  }

  /**
   * Obtener todas las wallets del usuario
   */
  async getWallets(): Promise<Wallet[]> {
    const response = await fetch(`${API_URL}/auth/wallets`, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al obtener wallets');
    }

    return response.json();
  }

  /**
   * Obtener el perfil del usuario autenticado
   */
  async getProfile(): Promise<any> {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expirado, intentar refrescar
        await this.refreshAccessToken();
        return this.getProfile();
      }
      const error = await response.json();
      throw new Error(error.message || 'Error al obtener perfil');
    }

    return response.json();
  }

  /**
   * Refrescar el access token usando el refresh token
   */
  async refreshAccessToken(): Promise<void> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: this.refreshToken }),
    });

    if (!response.ok) {
      this.clearTokens();
      throw new Error('Session expired, please login again');
    }

    const data = await response.json();
    this.accessToken = data.accessToken;
    localStorage.setItem('accessToken', data.accessToken);
  }

  /**
   * Cerrar sesión (revocar token)
   */
  async logout(): Promise<void> {
    if (this.accessToken) {
      try {
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        });
      } catch (error) {
        console.error('Error logging out:', error);
      }
    }
    this.clearTokens();
  }

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return this.accessToken !== null;
  }

  /**
   * Obtener el access token actual
   */
  getAccessToken(): string | null {
    return this.accessToken;
  }

  /**
   * Guardar tokens en memoria y localStorage
   */
  private saveTokens(accessToken: string, refreshToken: string): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  /**
   * Limpiar tokens de memoria y localStorage
   */
  private clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
}

// Exportar instancia única (singleton)
export const authClient = new AuthClient();

// ===========================================
// EJEMPLOS DE USO
// ===========================================

/**
 * Ejemplo 1: Registro de usuario
 */
async function ejemploRegistro() {
  try {
    const resultado = await authClient.register(
      'nuevo@example.com',
      'Password123!',
      'Nuevo Usuario',
    );
    console.log('Usuario registrado:', resultado);
    console.log('Access Token:', resultado.accessToken);
  } catch (error) {
    console.error('Error en registro:', error);
  }
}

/**
 * Ejemplo 2: Login con email
 */
async function ejemploLoginEmail() {
  try {
    const resultado = await authClient.loginWithEmail(
      'usuario@example.com',
      'Password123!',
    );
    console.log('Login exitoso:', resultado);
  } catch (error) {
    console.error('Error en login:', error);
  }
}

/**
 * Ejemplo 3: Login con wallet (flujo completo)
 */
async function ejemploLoginWallet() {
  const walletAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';

  try {
    // Paso 1: Solicitar OTP
    console.log('Enviando OTP al email vinculado...');
    const requiresOtp = await authClient.initiateWalletLogin(walletAddress);

    if (requiresOtp) {
      console.log('OTP enviado. Por favor verifica tu email.');

      // Paso 2: El usuario ingresa el código (simulado aquí)
      const codigoOtp = '123456'; // En producción, esto vendría de un input

      console.log('Verificando código OTP...');
      const resultado = await authClient.verifyOtp(walletAddress, codigoOtp);
      console.log('Login exitoso con wallet:', resultado);
    }
  } catch (error) {
    console.error('Error en login con wallet:', error);
  }
}

/**
 * Ejemplo 4: Vincular wallet después del registro
 */
async function ejemploVincularWallet() {
  try {
    // Primero hacer login o registro
    await authClient.loginWithEmail('usuario@example.com', 'Password123!');

    // Vincular wallet
    const wallet = await authClient.addWallet(
      '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      'ethereum',
      'ETH',
      true, // wallet predeterminada
    );
    console.log('Wallet vinculada:', wallet);
  } catch (error) {
    console.error('Error al vincular wallet:', error);
  }
}

/**
 * Ejemplo 5: Obtener perfil del usuario
 */
async function ejemploObtenerPerfil() {
  try {
    const perfil = await authClient.getProfile();
    console.log('Perfil del usuario:', perfil);
    console.log('Wallets vinculadas:', perfil.wallets);
  } catch (error) {
    console.error('Error al obtener perfil:', error);
  }
}

/**
 * Ejemplo 6: Hacer una petición protegida con manejo de token expirado
 */
async function ejemploPeticionProtegida() {
  try {
    // Si el token está expirado, automáticamente se refrescará
    const wallets = await authClient.getWallets();
    console.log('Wallets del usuario:', wallets);
  } catch (error) {
    console.error('Error:', error);
  }
}

/**
 * Ejemplo 7: Flujo completo de autenticación
 */
async function ejemploFlujoCompleto() {
  try {
    // 1. Registrar usuario
    console.log('=== PASO 1: Registro ===');
    const registro = await authClient.register(
      'test@example.com',
      'SecurePass123!',
      'Test User',
    );
    console.log('Usuario registrado:', registro.user);

    // 2. Vincular wallet
    console.log('\n=== PASO 2: Vincular Wallet ===');
    const wallet = await authClient.addWallet(
      '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      'ethereum',
      'ETH',
      true,
    );
    console.log('Wallet vinculada:', wallet);

    // 3. Obtener perfil
    console.log('\n=== PASO 3: Obtener Perfil ===');
    const perfil = await authClient.getProfile();
    console.log('Perfil completo:', perfil);

    // 4. Cerrar sesión
    console.log('\n=== PASO 4: Cerrar Sesión ===');
    await authClient.logout();
    console.log('Sesión cerrada');

    // 5. Login con wallet
    console.log('\n=== PASO 5: Login con Wallet ===');
    await authClient.initiateWalletLogin(wallet.address);
    console.log('OTP enviado, ingrese el código...');
    // En producción, aquí esperarías el input del usuario
  } catch (error) {
    console.error('Error en flujo completo:', error);
  }
}

// Para usar en el navegador:
// 1. Copia este código en la consola del navegador
// 2. Ejecuta cualquier ejemplo: ejemploRegistro(), ejemploLoginEmail(), etc.
