import axios from 'axios';

/**
 * Retorna true quando a falha ocorreu porque a API está offline/inacessível
 * (sem resposta HTTP, timeout ou erro de rede), evitando ruído no console.
 */
export function isApiOfflineError(error: unknown): boolean {
  if (!error) return false;

  if (axios.isAxiosError(error)) {
    if (!error.response) return true;
    return error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED';
  }

  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    return (
      error.name === 'AbortError' ||
      error.name === 'TimeoutError' ||
      msg.includes('network error') ||
      msg.includes('fetch failed') ||
      msg.includes('econnrefused')
    );
  }

  return false;
}

/**
 * Registra aviso apenas quando o erro não é mera indisponibilidade offline da API.
 */
export function logNonNetworkWarning(context: string, error: unknown): void {
  if (!isApiOfflineError(error)) {
    console.warn(context, error);
  }
}
