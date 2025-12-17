interface ParceiraLinkProps {
  nome: string;
  link?: string | null;
}

const ParceiraLink = ({ nome, link }: ParceiraLinkProps) => {
  if (link) {
    return (
      <a 
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-white transition-colors duration-300 underline font-bold text-lg"
        style={{ color: '#C9A45C' }}
      >
        {nome}
      </a>
    );
  }
  
  return (
    <span className="font-bold text-lg" style={{ color: '#C9A45C' }}>
      {nome}
    </span>
  );
};

export default ParceiraLink;
