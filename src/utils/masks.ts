export const maskPhone = (value: string) => {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d{4})/, '$1-$2')
        .substring(0, 15);
};

export const maskWhatsapp = (value: string) => {
    let cleanValue = value.replace(/\D/g, '');

    // Limite para DDI (2) + DDD (2) + Nono dígito (1) + Número (8) = 13 dígitos
    cleanValue = cleanValue.substring(0, 13);

    // Se o usuário começar digitando '55', formatamos como internacional
    if (cleanValue.startsWith('55') || cleanValue.length > 11) {
        return cleanValue
            .replace(/^(\d{2})/, '+$1')
            .replace(/(^\+\d{2})(\d)/, '$1 ($2')
            .replace(/(^\+\d{2}\s\(\d{2})(\d)/, '$1) $2')
            .replace(/(\d{5})(\d{1,4})$/, '$1-$2');
    }

    // Caso contrário, usa formatação local padrão
    return maskPhone(value);
};

export const maskCnpj = (value: string) => {
    return value
        .replace(/\D/g, '')
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .substring(0, 18);
};

export const maskCpf = (value: string) => {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .substring(0, 14);
};

export const maskCep = (value: string) => {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .substring(0, 9);
};
