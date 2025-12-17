/**
 * PageContext - Define o contexto de uso da página
 * Usado para controlar qual logo/branding deve ser exibido
 */
export enum PageContext {
  /**
   * AUTHENTICATION - Páginas de autenticação (login, signup, reset password)
   * Sempre exibe logo padrão "Referência Partner"
   */
  AUTHENTICATION = 'AUTHENTICATION',
  
  /**
   * NAVIGATION - Páginas de seleção/navegação (meeting-selection, meeting2-selection)
   * Sempre exibe logo padrão "Referência Partner"
   */
  NAVIGATION = 'NAVIGATION',
  
  /**
   * PRESENTATION - Páginas de apresentação (step1, step2, meeting2, ferramentas, etc)
   * Exibe logo customizada do branding (se em preview mode ou usuário autenticado)
   */
  PRESENTATION = 'PRESENTATION'
}
