/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform } from 'motion/react';
import { Menu, X, Instagram, Facebook, Phone, MapPin, Scissors, Ruler, Shirt, ChevronRight, Star, MessageCircle, Send } from 'lucide-react';
import { useState, useEffect, type FormEvent } from 'react';
import { BookingSystem } from './components/booking/BookingSystem';

// --- Shared Components ---

const SectionTitle = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="mb-12 text-center">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-gold uppercase tracking-[0.3em] text-xs font-semibold mb-3"
    >
      {subtitle}
    </motion.div>
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 }}
      className="text-4xl md:text-5xl font-medium"
    >
      {title}
    </motion.h2>
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3, duration: 0.8 }}
      className="w-24 h-px bg-gold mx-auto mt-6"
    />
  </div>
);

// --- Navbar ---

const Navbar = ({ onBookingOpen }: { onBookingOpen: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Início', href: '#home' },
    { name: 'Sobre', href: '#about' },
    { name: 'Serviços', href: '#services' },
    { name: 'Galeria', href: '#gallery' },
    { name: 'Depoimentos', href: '#testimonials' },
    { name: 'Contacto', href: '#contact' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled ? 'bg-black/90 backdrop-blur-md py-4' : 'bg-transparent py-8'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <motion.a 
          href="#home"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-serif tracking-widest text-white group"
        >
          FASHION <span className="text-gold group-hover:text-white transition-colors duration-300">MITO'O</span>
        </motion.a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link, i) => (
            <motion.a
              key={link.name}
              href={link.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-sm uppercase tracking-widest hover:text-gold transition-colors"
            >
              {link.name}
            </motion.a>
          ))}
          <motion.button
            onClick={onBookingOpen}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-6 py-2 border border-gold text-gold text-xs uppercase tracking-widest hover:bg-gold hover:text-black transition-all duration-300"
          >
            Agendar Medida
          </motion.button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden bg-black/95 absolute w-full top-full left-0 py-10 px-6 border-b border-gold/20"
        >
          <div className="flex flex-col gap-6 items-center">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-lg uppercase tracking-widest hover:text-gold"
              >
                {link.name}
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

// --- Hero ---

const Hero = ({ onBookingOpen }: { onBookingOpen: () => void }) => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);

  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      <motion.div 
        style={{ y: y1 }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-black/60 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1594932224010-74f4abaa8db1?auto=format&fit=crop&q=80&w=2000" 
          alt="Tailor at work"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </motion.div>

      <div className="relative z-20 text-center px-6">
        <motion.span
          initial={{ opacity: 0, letterSpacing: '0.1em' }}
          animate={{ opacity: 1, letterSpacing: '0.5em' }}
          transition={{ duration: 1 }}
          className="block text-gold text-sm md:text-base uppercase mb-6"
        >
          Arte & Sofisticação
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-6xl md:text-8xl lg:text-9xl font-serif font-light mb-8 leading-tight"
        >
          Elegância <br /> <span className="italic">sob medida</span>
        </motion.h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col md:flex-row gap-6 justify-center items-center"
        >
          <button
            onClick={onBookingOpen}
            className="px-10 py-4 bg-gold text-black font-semibold uppercase tracking-[0.2em] text-sm hover:bg-gold-light transition-all duration-300"
          >
            Agendar Agora
          </button>
          <a
            href="#gallery"
            className="px-10 py-4 border border-white text-white font-semibold uppercase tracking-[0.2em] text-sm hover:bg-white hover:text-black transition-all duration-300"
          >
            Ver Coleção
          </a>
        </motion.div>
      </div>

      <motion.div
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center"
      >
        <div className="w-px h-12 bg-linear-to-b from-white to-transparent" />
      </motion.div>
    </section>
  );
};

// --- About ---

const About = () => {
  return (
    <section id="about" className="py-24 md:py-32 bg-black relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -top-6 -left-6 w-32 h-32 border-t-2 border-l-2 border-gold/40 z-0" />
            <img 
              src="/sobre-fundador.jpg" 
              alt="Fundador da Fashion Mito'o - Alfaiataria em Maputo"
              className="relative z-10 w-full aspect-3/4 object-contain bg-zinc-900"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-10 -right-10 bg-gold p-8 hidden lg:block z-20">
              <span className="block text-4xl font-serif text-black mb-1">15+</span>
              <span className="text-black/70 text-xs uppercase tracking-widest font-bold">Anos de <br />Experiência</span>
            </div>
          </motion.div>

          <div className="flex flex-col gap-8">
            <span className="text-gold uppercase tracking-[0.3em] text-xs font-semibold">Nossa História</span>
            <h2 className="text-4xl md:text-5xl font-medium leading-tight">
              A Arte da Alfaiataria <br /> <span className="italic text-gold">em sua forma mais pura</span>
            </h2>
            <p className="text-gray-400 leading-relaxed text-lg">
              Fundada com o compromisso de resgatar a tradição da alta costura, a Fashion Mito'o nasceu da paixão pelo detalhe. Cada ponto, cada corte e cada ajuste é realizado com a precisão de um artista que entende que um fato não é apenas vestuário, mas uma extensão da personalidade.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Trabalhamos com os tecidos mais nobres do mercado local e internacional, garantindo um caimento impecável que valoriza a silhueta e proporciona conforto absoluto. Nossa missão é elevar sua confiança através da elegância atemporal.
            </p>
            
            <div className="grid grid-cols-2 gap-8 pt-6 border-t border-gold/10">
              <div className="flex flex-col gap-2">
                <Scissors className="text-gold mb-2" size={32} />
                <h4 className="font-serif text-xl">Corte Preciso</h4>
                <p className="text-gray-500 text-sm">Medidas tiradas milimetricamente para um ajuste perfeito.</p>
              </div>
              <div className="flex flex-col gap-2">
                <Ruler className="text-gold mb-2" size={32} />
                <h4 className="font-serif text-xl">Consultoria Estilo</h4>
                <p className="text-gray-500 text-sm">Orientação especializada para escolher o modelo ideal.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Services ---

const Services = () => {
  const services = [
    {
      title: 'Fatos Sob Medida',
      description: 'Experiência completa de alfaiataria bespoke, do desenho à entrega final.',
      icon: <Shirt className="text-gold" size={40} />,
      image: 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'Ajustes de Roupa',
      description: 'Transforme qualquer peça pronta com ajustes precisos que valorizam seu corpo.',
      icon: <Ruler className="text-gold" size={40} />,
      image: 'https://images.unsplash.com/photo-1558223126-6467335607ed?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'Uniformes Corporativos',
      description: 'Elegância e padronização para sua empresa com materiais de alta durabilidade.',
      icon: <Scissors className="text-gold" size={40} />,
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'Vestuário Tradicional',
      description: 'Capulanas e trajes tradicionais africanos com toques de modernidade.',
      icon: <Star className="text-gold" size={40} />,
      image: 'https://images.unsplash.com/photo-1518893883800-45cd0954574b?auto=format&fit=crop&q=80&w=800'
    }
  ];

  return (
    <section id="services" className="py-24 bg-atelier-pattern">
      <div className="max-w-7xl mx-auto px-6">
        <SectionTitle title="Nossos Serviços" subtitle="Exclusividade" />
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-black border border-gold/10 hover:border-gold/50 transition-all duration-300 overflow-hidden"
            >
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
              </div>
              <div className="p-8">
                <div className="mb-4">{service.icon}</div>
                <h3 className="text-2xl font-serif mb-4 text-white group-hover:text-gold transition-colors">{service.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">{service.description}</p>
                <a href="#contact" className="text-gold text-xs uppercase tracking-widest font-bold flex items-center gap-2 group/link">
                  Saiba Mais <ChevronRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Gallery ---

const Gallery = () => {
  const images = [
    { src: '/formatura-rosa.jpg', alt: "Grupo de formatura com vestidos rosa e fatos vermelhos - Fashion Mito'o", caption: 'Formatura - Vestidos de Gala e Fatos', span: 'col-span-2 row-span-2' },
    { src: '/damas-praia.jpg', alt: "Quatro damas de honor com vestidos salmon na praia - Fashion Mito'o", caption: 'Damas de Honor - Vestidos Salmon', span: 'col-span-2' },
    { src: '/formatura-vermelha.jpg', alt: "Grupo de formatura com vestidos vermelhos e camisas brancas - Fashion Mito'o", caption: 'Formatura - Vestidos Vermelhos', span: 'col-span-2 row-span-2' },
    { src: '/damas-ferrugem.jpg', alt: "Quatro damas com vestidos cor de ferrugem - Fashion Mito'o", caption: 'Damas de Honor - Vestidos Ferrugem', span: 'col-span-2' },
  ];

  return (
    <section id="gallery" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <SectionTitle title="Trabalhos Realizados" subtitle="Portfólio" />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[220px] md:auto-rows-[250px]">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`${img.span} relative overflow-hidden group cursor-pointer`}
            >
              <img 
                src={img.src} 
                alt={`Trabalho ${i + 1}`} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/20 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-gold">
                    <Star size={20} fill="currentColor" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <button className="text-gold uppercase tracking-[0.3em] text-xs font-bold hover:text-white transition-colors">
            Ver Mais No Instagram
          </button>
        </div>
      </div>
    </section>
  );
};

// --- Testimonials ---

const Testimonials = () => {
  const reviews = [
    {
      name: "Ricardo Matsinhe",
      role: "Empresário",
      text: "O Fashion Mito'o transformou completamente meu guarda-roupa. A atenção aos detalhes e o caimento do terno sob medida são incomparáveis.",
      rating: 5
    },
    {
      name: "Elena Chivambo",
      role: "Advogada",
      text: "Excelente atendimento e profissionalismo. Fiz ajustes em vários vestidos de gala e o resultado foi perfeito cada vez.",
      rating: 5
    },
    {
      name: "Jorge Macuácua",
      role: "CEO Tech",
      text: "Alfaiataria de classe mundial no coração de Maputo. Recomendo para qualquer pessoa que valoriza a elegância verdadeira.",
      rating: 5
    }
  ];

  return (
    <section id="testimonials" className="py-24 bg-atelier-pattern bg-black/50">
      <div className="max-w-7xl mx-auto px-6">
        <SectionTitle title="O Que Dizem" subtitle="Avaliações" />
        
        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, i) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-10 border border-gold/10 bg-black relative"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="#D4AF37" className="text-gold" />
                ))}
              </div>
              <p className="text-gray-400 italic mb-8 leading-relaxed">"{review.text}"</p>
              <div>
                <h4 className="text-white font-serif text-xl">{review.name}</h4>
                <p className="text-gold text-xs uppercase tracking-widest">{review.role}</p>
              </div>
              <div className="absolute top-8 right-8 opacity-10">
                <MessageCircle size={40} className="text-gold" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Contact ---

const Contact = () => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      setFormState({ name: '', email: '', message: '' });
    }, 1500);
  };

  return (
    <section id="contact" className="py-24 bg-black relative overflow-hidden">
      {/* Decorative vertical text */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden lg:block opacity-10">
        <span className="text-gold text-[10vw] font-serif uppercase select-none rotate-90 inline-block origin-center pointer-events-none">
          CONTATO
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20">
          <div>
            <SectionTitle title="Entre em Contacto" subtitle="Localização" />
            
            <div className="flex flex-col gap-10 mt-12">
              <div className="flex gap-6 items-start group">
                <div className="w-14 h-14 bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black transition-colors">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-serif mb-2">Visite-nos</h4>
                  <p className="text-gray-400">379X+77, Mahongage<br />Próximo ao Grupo Mágico (Auto Peças)<br />Maxixe, Inhambane, Moçambique</p>
                </div>
              </div>
              <div className="flex gap-6 items-start group">
                <div className="w-14 h-14 bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black transition-colors">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-serif mb-2">Ligue ou WhatsApp</h4>
                  <p className="text-gray-400">+258 84 021 8385<br />Mon - Sat: 08:00 - 18:00</p>
                </div>
              </div>
              <div className="flex gap-6 items-start group">
                <div className="w-14 h-14 bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black transition-colors">
                  <Send size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-serif mb-2">E-mail</h4>
                  <p className="text-gray-400">geral@fashionmito.co.mz<br />consultoria@fashionmito.co.mz</p>
                </div>
              </div>
            </div>
            
            <div className="mt-16">
              <iframe
                title="Localização Fashion Mito'o - Mahongage, Maxixe, Inhambane"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d500!2d35.3472!3d-23.8597!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1f3e5b0000000000%3A0x0!2zMjPCsDUxJzM1LjAiUyAzNcKwMjAnNTAuMCJF!5e1!3m2!1spt!2smz!4v1&q=379X%2B77+Mahongage"
                className="w-full h-48 md:h-72 border border-gold/10"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a
                href="https://maps.google.com/?q=379X%2B77+Mahongage+Maxixe"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-gold text-xs uppercase tracking-widest hover:text-white transition-colors"
              >
                Abrir no Google Maps →
              </a>
            </div>
          </div>

          <div className="bg-atelier-pattern p-10 border border-gold/10">
            <h3 className="text-3xl font-serif mb-8 italic">Envie sua mensagem</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-gold text-xs uppercase tracking-widest font-bold">Nome Completo</label>
                <input 
                  type="text" 
                  value={formState.name}
                  onChange={(e) => setFormState({...formState, name: e.target.value})}
                  className="bg-transparent border-b border-gold/30 py-3 outline-hidden focus:border-gold transition-colors text-white" 
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gold text-xs uppercase tracking-widest font-bold">E-mail</label>
                <input 
                  type="email" 
                  value={formState.email}
                  onChange={(e) => setFormState({...formState, email: e.target.value})}
                  className="bg-transparent border-b border-gold/30 py-3 outline-hidden focus:border-gold transition-colors text-white" 
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gold text-xs uppercase tracking-widest font-bold">Mensagem</label>
                <textarea 
                  rows={4}
                  value={formState.message}
                  onChange={(e) => setFormState({...formState, message: e.target.value})}
                  className="bg-transparent border-b border-gold/30 py-3 outline-hidden focus:border-gold transition-colors text-white resize-none" 
                  required
                />
              </div>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="mt-6 flex items-center justify-center gap-3 bg-gold text-black py-4 uppercase tracking-widest text-sm font-bold hover:bg-gold-light transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Enviando...' : (isSent ? 'Mensagem Enviada' : 'Enviar Pedido')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Footer ---

const Footer = () => {
  return (
    <footer className="py-20 bg-black border-t border-gold/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-12 mb-16">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-serif tracking-widest mb-4">FASHION <span className="text-gold">MITO'O</span></h2>
            <p className="text-gray-500 max-w-sm">Especialistas em alfaiataria bespoke e ajustes de alta costura. Onde a tradição encontra o estilo contemporâneo.</p>
          </div>
          <div className="flex gap-8">
            <a href="#" className="w-12 h-12 rounded-full border border-gold/20 flex items-center justify-center text-gold hover:bg-gold hover:text-black transition-all">
              <Instagram size={20} />
            </a>
            <a href="https://www.facebook.com/miltonjosepascoal.zualo.9" target="_blank" rel="noopener noreferrer" aria-label="Facebook de Mito o Jose Zualo" className="w-12 h-12 rounded-full border border-gold/20 flex items-center justify-center text-gold hover:bg-gold hover:text-black transition-all">
              <Facebook size={20} />
            </a>
            <a href="#" className="w-12 h-12 rounded-full border border-gold/20 flex items-center justify-center text-gold hover:bg-gold hover:text-black transition-all">
              <Phone size={20} />
            </a>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-10 border-b border-gold/10 pb-12 mb-12">
          {['Termos & Condições', 'Política de Privacidade', 'Perguntas Frequentes', 'Carrinho de Estilo'].map(link => (
            <a key={link} href="#" className="text-xs uppercase tracking-widest text-gray-500 hover:text-gold transition-colors">{link}</a>
          ))}
        </div>
        
        <div className="text-center text-gray-600 text-[10px] uppercase tracking-widest">
          © {new Date().getFullYear()} Fashion Mito'o. Todos os direitos reservados. Maputo, Moçambique.
        </div>
      </div>
    </footer>
  );
};

// --- WhatsApp Floating Button ---

const WhatsAppButton = () => {
  return (
    <motion.a
      href="https://wa.me/258840218385"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="fixed bottom-8 right-8 bg-[#25D366] text-white p-4 rounded-full shadow-2xl z-[100] group"
    >
      <MessageCircle size={32} />
      <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-black text-white px-4 py-2 rounded-lg text-xs uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl border border-gold/20">
        Fale Connosco
      </span>
    </motion.a>
  );
};


// --- Main App Export ---

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <div className="bg-black scroll-smooth">
      <Navbar onBookingOpen={() => setIsBookingOpen(true)} />
      <Hero onBookingOpen={() => setIsBookingOpen(true)} />
      <About />
      <Services />
      <Gallery />
      <Testimonials />
      <Contact />
      <Footer />
      <WhatsAppButton />
      <BookingSystem isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </div>
  );
}
