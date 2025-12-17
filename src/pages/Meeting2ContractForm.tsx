import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle2, Upload, Plus, X, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import ContractSuccess from '@/components/meeting2/ContractSuccess';

interface FormData {
  // Documentos
  documentos: File[];
  
  // Dados Pessoais
  naturalidade: string;
  estadoCivil: string;
  profissao: string;
  profissaoConjuge: string;
  
  // Endereços
  residenciaExterior: boolean;
  enderecoExterior: string;
  enderecoBrasil: string;
  
  // Financeiro
  rendaMensal: string;
  cpf: string;
  
  // Contatos
  emails: string[];
  telefones: string[];
}

const Meeting2ContractForm = () => {
  const navigate = useNavigate();
  useScrollToTop();
  
  const [formData, setFormData] = useState<FormData>({
    documentos: [],
    naturalidade: '',
    estadoCivil: '',
    profissao: '',
    profissaoConjuge: '',
    residenciaExterior: false,
    enderecoExterior: '',
    enderecoBrasil: '',
    rendaMensal: '',
    cpf: '',
    emails: [''],
    telefones: ['']
  });

  const [dragOver, setDragOver] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  React.useEffect(() => {
    const clienteInfo = localStorage.getItem("clienteInfo");
    if (!clienteInfo) {
      navigate("/meeting2/commitments");
    }
  }, [navigate]);

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      setFormData(prev => ({
        ...prev,
        documentos: [...prev.documentos, ...newFiles]
      }));
    }
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documentos: prev.documentos.filter((_, i) => i !== index)
    }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const addEmail = () => {
    setFormData(prev => ({
      ...prev,
      emails: [...prev.emails, '']
    }));
  };

  const removeEmail = (index: number) => {
    if (formData.emails.length > 1) {
      setFormData(prev => ({
        ...prev,
        emails: prev.emails.filter((_, i) => i !== index)
      }));
    }
  };

  const addTelefone = () => {
    setFormData(prev => ({
      ...prev,
      telefones: [...prev.telefones, '']
    }));
  };

  const removeTelefone = (index: number) => {
    if (formData.telefones.length > 1) {
      setFormData(prev => ({
        ...prev,
        telefones: prev.telefones.filter((_, i) => i !== index)
      }));
    }
  };

  const updateEmail = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      emails: prev.emails.map((email, i) => i === index ? value : email)
    }));
  };

  const updateTelefone = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      telefones: prev.telefones.map((tel, i) => i === index ? value : tel)
    }));
  };

  const formatCPF = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    return numericValue
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    if (numericValue === '') return '';
    
    const formattedValue = (Number(numericValue) / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
    
    return formattedValue;
  };

  const isFormValid = () => {
    return (
      formData.naturalidade &&
      formData.estadoCivil &&
      formData.profissao &&
      formData.enderecoBrasil &&
      formData.rendaMensal &&
      formData.cpf &&
      formData.emails.some(email => email) &&
      formData.telefones.some(tel => tel) &&
      (formData.estadoCivil !== 'Casado(a)' || formData.profissaoConjuge)
    );
  };

  const handleContinue = () => {
    if (isFormValid()) {
      localStorage.setItem('contractData', JSON.stringify(formData));
      setShowSuccess(true);
    }
  };

  const handleBackToSelection = () => {
    navigate("/meeting-selection");
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen px-4 py-6" style={{ backgroundColor: "#163B36" }}>
        <div className="max-w-4xl mx-auto pt-20">
          <ContractSuccess onBackToSelection={handleBackToSelection} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-6" style={{ backgroundColor: "#163B36" }}>
      <div id="top" className="absolute top-0 left-0 w-1 h-1" />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-center mb-8 relative">
          <Button
            onClick={() => navigate("/meeting2/commitments")}
            variant="ghost"
            size="icon"
            className="absolute left-0 text-white hover:bg-white/10 rounded-full w-12 h-12"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          
          <div className="flex items-center gap-3 px-6 py-3 rounded-full text-sm font-bold text-black bg-gradient-to-r from-[#C9A45C] to-[#E5C875] shadow-lg">
            <CheckCircle2 className="w-5 h-5" />
            <span>EMISSÃO DE CONTRATO</span>
          </div>
        </header>

        {/* Main Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-white to-[#C9A45C] bg-clip-text text-transparent">
            A conquista da sua liberdade financeira começou
          </h1>
        </div>

        {/* Form */}
        <div className="space-y-8">
          {/* Upload de Documentos */}
          <Card className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-3xl overflow-hidden">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Documentos Pessoais</h3>
              
              <div
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                  dragOver 
                    ? 'border-[#C9A45C] bg-[#C9A45C]/10' 
                    : 'border-white/30 hover:border-[#C9A45C]/50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 text-[#C9A45C] mx-auto mb-4" />
                <p className="text-white text-lg mb-2">
                  Arraste e solte seus documentos aqui
                </p>
                <p className="text-white/60 mb-4">
                  ou clique para selecionar (PDF, JPG, PNG)
                </p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button className="bg-[#C9A45C] text-black hover:bg-[#E5C875]">
                    Selecionar Arquivos
                  </Button>
                </label>
              </div>

              {/* Lista de Arquivos */}
              {formData.documentos.length > 0 && (
                <div className="mt-6 space-y-2">
                  {formData.documentos.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-[#C9A45C]" />
                        <span className="text-white">{file.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Dados Pessoais */}
          <Card className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-3xl overflow-hidden">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Dados Pessoais</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-white">Naturalidade *</Label>
                  <Input
                    value={formData.naturalidade}
                    onChange={(e) => setFormData(prev => ({ ...prev, naturalidade: e.target.value }))}
                    placeholder="Cidade/Estado de nascimento"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Estado Civil *</Label>
                  <Select
                    value={formData.estadoCivil}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, estadoCivil: value, profissaoConjuge: value !== 'Casado(a)' ? '' : prev.profissaoConjuge }))}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Solteiro(a)">Solteiro(a)</SelectItem>
                      <SelectItem value="Casado(a)">Casado(a)</SelectItem>
                      <SelectItem value="Divorciado(a)">Divorciado(a)</SelectItem>
                      <SelectItem value="Viúvo(a)">Viúvo(a)</SelectItem>
                      <SelectItem value="União Estável">União Estável</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Profissão *</Label>
                  <Input
                    value={formData.profissao}
                    onChange={(e) => setFormData(prev => ({ ...prev, profissao: e.target.value }))}
                    placeholder="Sua profissão"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                </div>

                {formData.estadoCivil === 'Casado(a)' && (
                  <div className="space-y-2">
                    <Label className="text-white">Profissão do Cônjuge *</Label>
                    <Input
                      value={formData.profissaoConjuge}
                      onChange={(e) => setFormData(prev => ({ ...prev, profissaoConjuge: e.target.value }))}
                      placeholder="Profissão do cônjuge"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Endereços */}
          <Card className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-3xl overflow-hidden">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Endereços</h3>
              
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="residenciaExterior"
                    checked={formData.residenciaExterior}
                    onChange={(e) => setFormData(prev => ({ ...prev, residenciaExterior: e.target.checked }))}
                    className="w-4 h-4 text-[#C9A45C] bg-white/10 border-white/20 rounded focus:ring-[#C9A45C]"
                  />
                  <Label htmlFor="residenciaExterior" className="text-white">
                    Possui residência no exterior
                  </Label>
                </div>

                {formData.residenciaExterior && (
                  <div className="space-y-2">
                    <Label className="text-white">Endereço no Exterior</Label>
                    <Textarea
                      value={formData.enderecoExterior}
                      onChange={(e) => setFormData(prev => ({ ...prev, enderecoExterior: e.target.value }))}
                      placeholder="Endereço completo no exterior"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      rows={3}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-white">Endereço no Brasil *</Label>
                  <Textarea
                    value={formData.enderecoBrasil}
                    onChange={(e) => setFormData(prev => ({ ...prev, enderecoBrasil: e.target.value }))}
                    placeholder="Endereço completo no Brasil"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dados Financeiros */}
          <Card className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-3xl overflow-hidden">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Dados Financeiros</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-white">Renda Mensal *</Label>
                  <Input
                    value={formData.rendaMensal}
                    onChange={(e) => setFormData(prev => ({ ...prev, rendaMensal: formatCurrency(e.target.value) }))}
                    placeholder="R$ 0,00"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">CPF *</Label>
                  <Input
                    value={formData.cpf}
                    onChange={(e) => setFormData(prev => ({ ...prev, cpf: formatCPF(e.target.value) }))}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contatos */}
          <Card className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-3xl overflow-hidden">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Contatos</h3>
              
              <div className="space-y-8">
                {/* E-mails */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-white text-lg">E-mails *</Label>
                    <Button
                      type="button"
                      onClick={addEmail}
                      variant="outline"
                      size="sm"
                      className="border-[#C9A45C] text-[#C9A45C] hover:bg-[#C9A45C] hover:text-black"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar E-mail
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {formData.emails.map((email, index) => (
                      <div key={index} className="flex gap-3">
                        <Input
                          value={email}
                          onChange={(e) => updateEmail(index, e.target.value)}
                          placeholder="email@exemplo.com"
                          type="email"
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/60 flex-1"
                        />
                        {formData.emails.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeEmail(index)}
                            variant="outline"
                            size="icon"
                            className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Telefones */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-white text-lg">Telefones *</Label>
                    <Button
                      type="button"
                      onClick={addTelefone}
                      variant="outline"
                      size="sm"
                      className="border-[#C9A45C] text-[#C9A45C] hover:bg-[#C9A45C] hover:text-black"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Telefone
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {formData.telefones.map((telefone, index) => (
                      <div key={index} className="flex gap-3">
                        <Input
                          value={telefone}
                          onChange={(e) => updateTelefone(index, e.target.value)}
                          placeholder="(00) 00000-0000"
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/60 flex-1"
                        />
                        {formData.telefones.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeTelefone(index)}
                            variant="outline"
                            size="icon"
                            className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Continue Button */}
        <div className="flex justify-center mt-16 mb-8">
          <Button
            onClick={handleContinue}
            disabled={!isFormValid()}
            className={`px-8 py-3 text-base font-semibold text-black rounded-xl transition-all duration-300 ${
              isFormValid() 
                ? 'hover:scale-105' 
                : 'opacity-50 cursor-not-allowed'
            }`}
            style={{ 
              background: isFormValid() 
                ? "linear-gradient(135deg, #C9A45C 0%, #E5C875 100%)"
                : "rgba(201, 164, 92, 0.5)"
            }}
          >
            Enviar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Meeting2ContractForm;