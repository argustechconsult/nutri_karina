
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateRetentionMessage = async (clientName: string, lastSession: string | undefined) => {
  const model = 'gemini-3-flash-preview';
  const prompt = `Escreva uma mensagem curta, acolhedora e profissional para o WhatsApp de um paciente de nutrição chamado ${clientName} que não comparece a uma consulta desde ${lastSession || 'algum tempo'}. O objetivo é demonstrar preocupação com o processo dele e oferecer um novo horário de forma gentil. A profissional é Karina, Nutricionista Clínica e Comportamental. Mantenha o tom encorajador e sem julgamentos.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return `Olá ${clientName}, como você está? Notei que faz um tempo que não conversamos sobre sua alimentação. Gostaria de saber se está tudo bem e se quer retomar nosso acompanhamento. Abraços, Karina.`;
  }
};

export const generateConfirmationMessage = async (clientName: string, date: string, time: string, meetLink: string) => {
  const model = 'gemini-3-flash-preview';
  const prompt = `Escreva uma mensagem de confirmação de consulta nutricional para o paciente ${clientName}. 
  Data: ${date} às ${time}. 
  Link da sessão: ${meetLink}. 
  A profissional é Karina, Nutricionista Clínica e Comportamental. 
  A mensagem deve ser profissional e motivadora, lembrando que o processo de saúde é constante.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    return `Olá ${clientName}, sua consulta com a Nutri Karina está confirmada para ${date} às ${time}. Link: ${meetLink}. Até lá!`;
  }
};
