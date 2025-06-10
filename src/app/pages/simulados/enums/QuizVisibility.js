/**
 * Enum for Quiz Visibility states
 */
export const QuizVisibility = {
  DRAFT: 'draft',
  PUBLIC: 'public', 
  ARCHIVED: 'archived'
};

/**
 * Get display text for visibility status
 * @param {string} visibility - The visibility status
 * @returns {string} Display text
 */
export const getVisibilityText = (visibility) => {
  switch (visibility) {
    case QuizVisibility.DRAFT:
      return 'Rascunho';
    case QuizVisibility.PUBLIC:
      return 'Público';
    case QuizVisibility.ARCHIVED:
      return 'Arquivado';
    default:
      return 'Desconhecido';
  }
};

/**
 * Get color class for visibility status
 * @param {string} visibility - The visibility status
 * @returns {string} CSS color class
 */
export const getVisibilityColor = (visibility) => {
  switch (visibility) {
    case QuizVisibility.DRAFT:
      return 'bg-yellow-100 text-yellow-800';
    case QuizVisibility.PUBLIC:
      return 'bg-green-100 text-green-800';
    case QuizVisibility.ARCHIVED:
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Get icon for visibility status
 * @param {string} visibility - The visibility status
 * @returns {string} Icon name
 */
export const getVisibilityIcon = (visibility) => {
  switch (visibility) {
    case QuizVisibility.DRAFT:
      return 'Edit';
    case QuizVisibility.PUBLIC:
      return 'Eye';
    case QuizVisibility.ARCHIVED:
      return 'Archive';
    default:
      return 'HelpCircle';
  }
};