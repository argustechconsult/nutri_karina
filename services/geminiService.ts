
import { GoogleGenAI } from "@google/genai";

const getGenAI = () => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.warn("API Key is missing for GoogleGenAI");
      return null;
    }
    return new GoogleGenAI({ apiKey });
  } catch (error) {
    console.error("Error initializing GoogleGenAI:", error);
    return null;
  }
};

export const generateRetentionMessage = async (clientName: string, lastSession: string | undefined) => {
  const modelName = 'gemini-1.5-flash';
  const prompt = `Escreva uma mensagem curta, acolhedora e profissional para o WhatsApp de um paciente de nutrição chamado ${clientName} que não comparece a uma consulta desde ${lastSession || 'algum tempo'}. O objetivo é demonstrar preocupação com o processo dele e oferecer um novo horário de forma gentil. A profissional é Karina, Nutricionista Clínica e Comportamental. Mantenha o tom encorajador e sem julgamentos.`;

  try {
    const ai = getGenAI();
    if (!ai) throw new Error("AI Service unavailable");
    
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return `Olá ${clientName}, como você está? Notei que faz um tempo que não conversamos sobre sua alimentação. Gostaria de saber se está tudo bem e se quer retomar nosso acompanhamento. Abraços, Karina.`;
  }
};

export const generateConfirmationMessage = async (clientName: string, date: string, time: string, meetLink: string) => {
  const modelName = 'gemini-1.5-flash';
  const prompt = `Escreva uma mensagem de confirmação de consulta nutricional para o paciente ${clientName}. 
  Data: ${date} às ${time}. 
  Link da sessão: ${meetLink}. 
  A profissional é Karina, Nutricionista Clínica e Comportamental. 
  A mensagem deve ser profissional e motivadora, lembrando que o processo de saúde é constante.`;

  try {
    const ai = getGenAI();
    if (!ai) throw new Error("AI Service unavailable");

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    return `Olá ${clientName}, sua consulta com a Nutri Karina está confirmada para ${date} às ${time}. Link: ${meetLink}. Até lá!`;
  }
};
