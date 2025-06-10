export const QuizVisibility = {
    DRAFT: 'draft',
    PUBLIC: 'public',
    ARCHIVED: 'archived'
};

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

export const getVisibilityIcon = (visibility) => {
    switch (visibility) {
        case QuizVisibility.DRAFT:
            return 'draft';
        case QuizVisibility.PUBLIC:
            return 'public';
        case QuizVisibility.ARCHIVED:
            return 'archive';
        default:
            return 'help';
    }
}; 