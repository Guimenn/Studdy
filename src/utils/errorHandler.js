import { toast } from "sonner";

/**
 * Trata erros de resposta da API
 * @param {Response} response - Objeto de resposta do fetch
 * @param {string} action - Ação que estava sendo executada
 * @returns {Promise<void>}
 */
export async function handleApiError(response, action) {
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Erro na servidor (${response.status}):`, errorText);
    
    let errorMessage = `Erro ao ${action}`;
    
    try {
      const errorData = JSON.parse(errorText);
      errorMessage = errorData.message || errorMessage;
    } catch {
      // Se não conseguir parsear o JSON, usa o texto do erro
      errorMessage = errorText || errorMessage;
    }

    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
}

/**
 * Trata erros de rede ou fetch
 * @param {Error} error - Erro capturado
 * @param {string} action - Ação que estava sendo executada
 */
export function handleFetchError(error, action) {
  console.error(`Erro ao ${action}:`, error);
  toast.error(`Erro ao ${action}. Verifique sua conexão e tente novamente.`);
  throw error;
}

/**
 * Trata erros de validação
 * @param {Error} error - Erro de validação
 * @param {string} field - Campo que falhou na validação
 */
export function handleValidationError(error, field) {
  console.error(`Erro de validação no campo ${field}:`, error);
  toast.error(`Campo ${field} inválido: ${error.message}`);
}

/**
 * Trata erros inesperados
 * @param {Error} error - Erro inesperado
 * @param {string} context - Contexto onde o erro ocorreu
 */
export function handleUnexpectedError(error, context) {
  console.error(`Erro inesperado em ${context}:`, error);
  toast.error(`Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.`);
} 