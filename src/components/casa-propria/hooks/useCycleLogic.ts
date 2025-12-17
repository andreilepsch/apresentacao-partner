
export const useCycleLogic = (
  selectedPath: 'rent-and-credit' | 'investment-first' | null,
  cycle: number
) => {
  const isPath1FirstCycle = selectedPath === 'rent-and-credit' && cycle === 1;
  const isPath2ThirdCycle = selectedPath === 'investment-first' && cycle === 3;
  const isPath2FourthCycle = selectedPath === 'investment-first' && cycle === 4;

  const shouldShowRentIncome = selectedPath === 'investment-first' 
    ? cycle >= 1 && cycle <= 4
    : cycle > 1;
  
  const rentableProperties = selectedPath === 'rent-and-credit' ? 
    Math.max(0, cycle - 1) : 
    cycle === 3 ? 2 : cycle === 4 ? 3 : cycle;

  const getPathSpecificText = () => {
    if (isPath2ThirdCycle) {
      return {
        title: "Ciclo 3 - Casa Própria",
        subtitle: "Conquista da casa própria mantendo investimentos",
        highlight: true
      };
    }
    if (isPath1FirstCycle) {
      return {
        title: "Ciclo 1 - Construindo Patrimônio",
        subtitle: "Adquirindo sua casa própria para moradia",
        highlight: false
      };
    }
    // Corrigir o Ciclo 4 para não mencionar casa própria
    if (isPath2FourthCycle) {
      return {
        title: "Ciclo 4 - Expansão dos Investimentos",
        subtitle: `Maximizando com ${rentableProperties} imóveis de investimento + casa própria`,
        highlight: false
      };
    }
    return {
      title: `Ciclo ${cycle} - Crescimento Patrimonial`,
      subtitle: selectedPath === 'rent-and-credit' 
        ? rentableProperties > 0
          ? `Expandindo portfólio com ${rentableProperties} imóve${rentableProperties === 1 ? 'l' : 'is'} de investimento`
          : 'Construindo base patrimonial com casa própria'
        : `Maximizando investimentos com ${rentableProperties} imóve${rentableProperties === 1 ? 'l' : 'is'}`,
      highlight: false
    };
  };

  return {
    isPath1FirstCycle,
    isPath2ThirdCycle,
    isPath2FourthCycle,
    shouldShowRentIncome,
    rentableProperties,
    pathText: getPathSpecificText()
  };
};
