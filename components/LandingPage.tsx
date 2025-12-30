import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  User,
  BookOpen,
  Phone,
  Mail,
  CheckCircle,
  Clock,
  Video,
  Send,
  Menu,
  X as CloseIcon,
  Apple,
  Utensils,
  Heart,
} from 'lucide-react';
import { Appointment, GlobalSettings } from '../types';
import { generateConfirmationMessage } from '../services/geminiService';

interface LandingPageProps {
  onBookingComplete: (
    client: { name: string; email: string; phone: string },
    appointment: { date: string; time: string },
  ) => Appointment;
  settings: GlobalSettings;
  appointments: Appointment[];
}

const LandingPage: React.FC<LandingPageProps> = ({
  onBookingComplete,
  settings,
  appointments,
}) => {
  const [showBooking, setShowBooking] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [clientInfo, setClientInfo] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [finalAppointment, setFinalAppointment] = useState<Appointment | null>(
    null,
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getBrazilDateTime = () => {
    return new Date(
      new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }),
    );
  };

  const todayStr = useMemo(() => {
    const brDate = getBrazilDateTime();
    const year = brDate.getFullYear();
    const month = String(brDate.getMonth() + 1).padStart(2, '0');
    const day = String(brDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  const timeSlots = useMemo(() => {
    const slots = [];
    const duration = settings.defaultDuration || 60;
    let current = new Date();
    current.setHours(8, 0, 0, 0);
    const morningEnd = new Date();
    morningEnd.setHours(12, 0, 0, 0);
    while (current < morningEnd) {
      slots.push(
        current.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      );
      current.setMinutes(current.getMinutes() + duration + 10);
    }
    current = new Date();
    current.setHours(13, 30, 0, 0);
    const afternoonEnd = new Date();
    afternoonEnd.setHours(19, 0, 0, 0);
    while (current < afternoonEnd) {
      slots.push(
        current.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      );
      current.setMinutes(current.getMinutes() + duration + 10);
    }
    return slots;
  }, [settings.defaultDuration]);

  const availableTimeSlots = useMemo(() => {
    if (!selectedDate) return [];
    const brNow = getBrazilDateTime();
    const currentHour = brNow.getHours();
    const currentMinute = brNow.getMinutes();

    return timeSlots.filter((time) => {
      if (selectedDate === todayStr) {
        const [hour, minute] = time.split(':').map(Number);
        if (
          hour < currentHour ||
          (hour === currentHour && minute <= currentMinute)
        )
          return false;
      }
      return !appointments.some(
        (app) =>
          app.date === selectedDate &&
          app.time === time &&
          app.status !== 'cancelled',
      );
    });
  }, [selectedDate, todayStr, timeSlots, appointments]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string,
  ) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const element = document.getElementById(targetId.replace('#', ''));
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      window.scrollTo({
        top: elementRect - bodyRect - offset,
        behavior: 'smooth',
      });
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const app = onBookingComplete(clientInfo, {
        date: selectedDate,
        time: selectedTime,
      });
      const message = await generateConfirmationMessage(
        clientInfo.name,
        new Date(selectedDate).toLocaleDateString('pt-BR'),
        selectedTime,
        app.meetLink || '',
      );
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setFinalAppointment(app);
      setBookingStep(3);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const closeBooking = () => {
    setShowBooking(false);
    setBookingStep(1);
    setIsProcessing(false);
    setSelectedDate('');
    setSelectedTime('');
    setClientInfo({ name: '', email: '', phone: '' });
    setFinalAppointment(null);
  };

  return (
    <div className="min-h-screen bg-[#FCF9F9] font-sans">
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-lg z-50 border-b border-rose-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div
            className="flex flex-col cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <span className="text-2xl font-bold text-slate-800 leading-tight">
              Karina
            </span>
            <span className="text-[10px] text-rose-400 font-bold tracking-widest uppercase">
              Nutrição Clínica & Comportamental
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-10">
            <a
              href="#inicio"
              onClick={(e) => handleNavClick(e, '#inicio')}
              className="text-slate-600 hover:text-rose-400 font-medium transition-colors"
            >
              Início
            </a>
            <a
              href="#sobre"
              onClick={(e) => handleNavClick(e, '#sobre')}
              className="text-slate-600 hover:text-rose-400 font-medium transition-colors"
            >
              Sobre
            </a>
            <a
              href="#especialidades"
              onClick={(e) => handleNavClick(e, '#especialidades')}
              className="text-slate-600 hover:text-rose-400 font-medium transition-colors"
            >
              Abordagem
            </a>
            <Link
              to="/login"
              className="text-rose-400 font-bold hover:text-rose-600 transition-colors"
            >
              Acesso Profissional
            </Link>
            <button
              onClick={() => setShowBooking(true)}
              className="btn-attention bg-rose-400 text-white px-8 py-3 rounded-full font-bold hover:bg-rose-500 transition-all shadow-lg"
            >
              Marcar Consulta
            </button>
          </div>

          <button
            className="md:hidden p-2 text-slate-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <CloseIcon size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-rose-100 shadow-xl py-8 px-6 flex flex-col space-y-6 animate-fade-in z-40">
            <a
              href="#inicio"
              onClick={(e) => handleNavClick(e, '#inicio')}
              className="text-slate-600 hover:text-rose-400 font-medium text-lg transition-colors"
            >
              Início
            </a>
            <a
              href="#sobre"
              onClick={(e) => handleNavClick(e, '#sobre')}
              className="text-slate-600 hover:text-rose-400 font-medium text-lg transition-colors"
            >
              Sobre
            </a>
            <a
              href="#especialidades"
              onClick={(e) => handleNavClick(e, '#especialidades')}
              className="text-slate-600 hover:text-rose-400 font-medium text-lg transition-colors"
            >
              Abordagem
            </a>
            <Link
              to="/login"
              className="text-rose-400 font-bold hover:text-rose-600 transition-colors text-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Acesso Profissional
            </Link>
            <button
              onClick={() => {
                setIsMenuOpen(false);
                setShowBooking(true);
              }}
              className="bg-rose-400 text-white px-8 py-4 rounded-full font-bold hover:bg-rose-500 transition-all shadow-lg w-full"
            >
              Marcar Consulta
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section
        id="inicio"
        className="pt-40 pb-20 bg-gradient-to-br from-[#FDF2F2] to-white scroll-mt-20 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in text-center md:text-left">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white border border-rose-100 text-rose-400 text-xs font-bold tracking-widest uppercase shadow-sm">
                CRN: 18100708 | Nutrição com Prazer
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-slate-900 leading-tight">
                Emagrecer pode ser{' '}
                <span className="text-rose-400 italic">prazeroso</span>.
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
                Você está a poucos passos de descobrir que saúde não precisa ser
                sinônimo de sofrimento e restrição desnecessária.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setShowBooking(true)}
                  className="bg-rose-400 text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-rose-500 transition-all shadow-xl shadow-rose-100"
                >
                  Agendar minha avaliação
                </button>
                <a
                  href="#sobre"
                  onClick={(e) => handleNavClick(e, '#sobre')}
                  className="px-10 py-5 rounded-full font-bold text-lg text-rose-400 border-2 border-rose-200 hover:bg-rose-50 transition-all text-center"
                >
                  Saiba mais
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-20 -right-20 w-80 h-80 bg-rose-200/30 rounded-full blur-3xl -z-10 animate-pulse"></div>
              <img
                src="/hero.jpeg"
                alt="Nutricionista Karina"
                className="rounded-[3rem] shadow-2xl border-8 border-white object-cover aspect-[4/5] transform hover:rotate-1 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="sobre" className="py-24 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="bg-[#FDF2F2] rounded-[3rem] p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 text-rose-200/50">
                <Utensils size={120} />
              </div>
              <h2 className="text-4xl font-bold text-slate-900 mb-8 relative">
                Seja protagonista da sua{' '}
                <span className="text-rose-400">própria história</span>
              </h2>
              <div className="space-y-6 text-slate-600 text-lg leading-relaxed relative">
                <p>
                  Nutricionista Clínica e Comportamental dedicada a transformar
                  a relação das pessoas com a comida.
                </p>
                <p>
                  Chega de frustrações. Se você busca o corpo dos sonhos sem
                  abrir mão da saúde e do prazer de comer, estou aqui para te
                  ajudar.
                </p>
                <div className="flex gap-4 pt-4">
                  <div className="flex-1 bg-white p-6 rounded-3xl shadow-sm text-center">
                    <Heart className="text-rose-400 mx-auto mb-2" size={24} />
                    <p className="font-bold text-slate-800">Autoestima</p>
                  </div>
                  <div className="flex-1 bg-white p-6 rounded-3xl shadow-sm text-center">
                    <Utensils
                      className="text-rose-400 mx-auto mb-2"
                      size={24}
                    />
                    <p className="font-bold text-slate-800">Equilíbrio</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-8">
              <h3 className="text-3xl font-bold text-slate-900">
                Como posso te ajudar?
              </h3>
              <ul className="space-y-6">
                {[
                  {
                    title: 'Nutrição Clínica',
                    desc: 'Acompanhamento focado em patologias e performance.',
                  },
                  {
                    title: 'Nutrição Comportamental',
                    desc: 'Tratando a raiz da sua relação com a comida.',
                  },
                  {
                    title: 'Emagrecimento Consciente',
                    desc: 'Resultados duradouros sem efeito sanfona.',
                  },
                ].map((item, i) => (
                  <li key={i} className="flex gap-5 group">
                    <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-rose-400 transition-colors">
                      <CheckCircle
                        size={24}
                        className="text-rose-400 group-hover:text-white"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-lg text-slate-800">
                        {item.title}
                      </p>
                      <p className="text-slate-500">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Specialties */}
      <section id="especialidades" className="py-24 bg-[#FDF9F9] scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-16">
            Minhas Especialidades
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-[2.5rem] border border-rose-50 hover:shadow-2xl transition-all">
              <Apple size={40} className="text-rose-400 mb-6 mx-auto" />
              <h4 className="text-xl font-bold mb-4">Plano Individualizado</h4>
              <p className="text-slate-500">
                Nada de dietas de gaveta. Tudo é pensado para a sua rotina e
                preferências.
              </p>
            </div>
            <div className="bg-white p-10 rounded-[2.5rem] border border-rose-50 hover:shadow-2xl transition-all">
              <Utensils size={40} className="text-rose-400 mb-6 mx-auto" />
              <h4 className="text-xl font-bold mb-4">
                Comportamento Alimentar
              </h4>
              <p className="text-slate-500">
                Entenda por que você come e aprenda a ouvir os sinais de fome e
                saciedade.
              </p>
            </div>
            <div className="bg-white p-10 rounded-[2.5rem] border border-rose-50 hover:shadow-2xl transition-all">
              <BookOpen size={40} className="text-rose-400 mb-6 mx-auto" />
              <h4 className="text-xl font-bold mb-4">Educação Nutricional</h4>
              <p className="text-slate-500">
                Conhecimento para que você tenha autonomia e liberdade nas suas
                escolhas.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-6">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-rose-300">
              Karina Rodrigues
            </span>
            <span className="text-xs text-rose-400 uppercase tracking-widest mt-1 font-black">
              Nutricionista CRN 18100708
            </span>
          </div>
          <div className="flex justify-center gap-6 text-slate-400">
            <Mail size={20} className="hover:text-rose-300 cursor-pointer" />
            <Phone size={20} className="hover:text-rose-300 cursor-pointer" />
          </div>
          <p className="text-slate-500 text-sm">
            © 2024 Nutri Karina - Saúde e Bem-estar.
          </p>
        </div>
      </footer>

      {/* Booking Modal */}
      {showBooking && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden relative animate-scale-up">
            <button
              onClick={closeBooking}
              className="absolute top-6 right-6 text-white/70 hover:text-white z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all backdrop-blur-sm"
            >
              <CloseIcon size={24} />
            </button>
            <div className="bg-gradient-to-r from-rose-400 to-rose-500 p-10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <Calendar size={120} />
              </div>
              <h3 className="text-3xl font-bold mb-2 tracking-tight relative z-10">
                Agendar Consulta
              </h3>
              <p className="text-rose-100 text-sm opacity-90 relative z-10">
                Online ou Presencial (Rio de Janeiro)
              </p>
            </div>
            <div className="p-10">
              {isProcessing ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-6 animate-pulse">
                  <div className="w-16 h-16 border-4 border-rose-100 border-t-rose-400 rounded-full animate-spin"></div>
                  <p className="text-xl font-bold text-slate-800">
                    Processando seu pedido...
                  </p>
                </div>
              ) : (
                <>
                  {bookingStep === 1 && (
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <label className="text-base font-bold text-slate-800 flex items-center gap-3">
                          <div className="bg-rose-100 p-2.5 rounded-xl text-rose-500 shadow-sm">
                            <Calendar size={20} />
                          </div>
                          <span className="tracking-tight">
                            Selecione o melhor dia
                          </span>
                        </label>
                        <div className="relative group">
                          <input
                            type="date"
                            min={todayStr}
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-5 px-6 outline-none focus:bg-white focus:border-rose-400 focus:ring-4 focus:ring-rose-100 transition-all font-medium text-slate-600 group-hover:border-rose-200 cursor-pointer appearance-none relative z-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                          />
                          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity z-20 hidden sm:block">
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-white px-2 py-1 rounded-md shadow-sm border border-rose-100">
                              Abrir Calendário
                            </span>
                          </div>
                        </div>
                      </div>
                      {selectedDate && (
                        <div className="space-y-4 animate-fade-in">
                          <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                            <Clock size={18} className="text-rose-400" />{' '}
                            Horários livres
                          </label>
                          <div className="grid grid-cols-3 gap-3 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
                            {availableTimeSlots.map((time) => (
                              <button
                                key={time}
                                onClick={() => setSelectedTime(time)}
                                className={`py-3 px-2 rounded-xl border-2 font-bold text-xs transition-all ${
                                  selectedTime === time
                                    ? 'bg-rose-400 border-rose-400 text-white'
                                    : 'bg-white border-slate-100 text-slate-500 hover:border-rose-200'
                                }`}
                              >
                                {time}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      <button
                        disabled={!selectedDate || !selectedTime}
                        onClick={() => setBookingStep(2)}
                        className="w-full bg-rose-400 text-white py-5 rounded-2xl font-bold text-lg disabled:opacity-40 shadow-lg shadow-rose-100"
                      >
                        Prosseguir
                      </button>
                    </div>
                  )}
                  {bookingStep === 2 && (
                    <form onSubmit={handleBookingSubmit} className="space-y-6">
                      <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100">
                        <p className="text-[10px] font-black uppercase tracking-widest text-rose-400 mb-1">
                          Resumo
                        </p>
                        <p className="font-bold text-xl text-rose-900">
                          {new Date(
                            selectedDate + 'T12:00:00',
                          ).toLocaleDateString('pt-BR')}{' '}
                          às {selectedTime}
                        </p>
                      </div>
                      <div className="space-y-4">
                        <input
                          type="text"
                          required
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 font-semibold"
                          value={clientInfo.name}
                          onChange={(e) =>
                            setClientInfo({
                              ...clientInfo,
                              name: e.target.value,
                            })
                          }
                          placeholder="Seu Nome Completo"
                        />
                        <input
                          type="tel"
                          required
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 font-semibold"
                          value={clientInfo.phone}
                          onChange={(e) =>
                            setClientInfo({
                              ...clientInfo,
                              phone: e.target.value,
                            })
                          }
                          placeholder="WhatsApp com DDD"
                        />
                        <input
                          type="email"
                          required
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 font-semibold"
                          value={clientInfo.email}
                          onChange={(e) =>
                            setClientInfo({
                              ...clientInfo,
                              email: e.target.value,
                            })
                          }
                          placeholder="Seu E-mail"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-rose-400 text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3"
                      >
                        <Send size={20} /> Confirmar Consulta
                      </button>
                    </form>
                  )}
                  {bookingStep === 3 && finalAppointment && (
                    <div className="text-center space-y-8 py-4">
                      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle size={40} />
                      </div>
                      <h3 className="text-3xl font-bold text-slate-900">
                        Agendado!
                      </h3>
                      <div className="bg-slate-900 rounded-[2rem] p-8 text-left text-white">
                        <p className="text-[10px] font-bold text-rose-300 uppercase tracking-widest mb-2">
                          Sua Sala Virtual
                        </p>
                        <a
                          href={finalAppointment.meetLink}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-lg break-all hover:text-rose-200 transition-colors"
                        >
                          {finalAppointment.meetLink}
                        </a>
                      </div>
                      <button
                        onClick={closeBooking}
                        className="w-full bg-slate-100 text-slate-800 py-5 rounded-2xl font-bold"
                      >
                        Concluir
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
