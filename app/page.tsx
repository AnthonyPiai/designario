'use client';
import { useEffect, useState } from 'react';
import { Process, usePageMotion } from './motion';
import {
  ServiceExplorer,
  PlanShowcase,
  MotionControl,
  HeroMotion,
} from './experience';
import {
  ArrowUpRight,
  ArrowDown,
  Plus,
  Check,
  Smartphone,
  Layers,
  PenTool,
  BookOpen,
  Clapperboard,
  PanelsTopLeft,
  MessageCircle,
  Menu,
  X,
} from 'lucide-react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from '@/components/ui/sheet';

const whatsapp = (
  message = 'Olá! Gostaria de solicitar um orçamento gratuito.',
) => `https://wa.me/5515996337454?text=${encodeURIComponent(message)}`;
const services = [
  {
    icon: Smartphone,
    title: 'Gestão de redes sociais',
    description:
      'Da estratégia à publicação. Conteúdo com consistência para aproximar sua marca das pessoas certas.',
    tags: 'INSTAGRAM · FACEBOOK',
  },
  {
    icon: Layers,
    title: 'Carrosséis e artes',
    description:
      'Ideias que prendem o olhar. Carrosséis, posts e stories que traduzem a sua mensagem em boas conversas.',
    tags: 'FEED · STORIES · CARROSSÉIS',
  },
  {
    icon: PenTool,
    title: 'Identidade visual',
    description:
      'Uma marca reconhecível em cada detalhe. Logotipos e sistemas visuais com personalidade e propósito.',
    tags: 'LOGOTIPO · BRANDING',
  },
  {
    icon: BookOpen,
    title: 'Design de cardápios',
    description:
      'Um convite para experimentar. Cardápios digitais e impressos pensados para valorizar cada escolha.',
    tags: 'DIGITAL · IMPRESSO',
  },
  {
    icon: Clapperboard,
    title: 'Vídeos curtos',
    description:
      'Sua mensagem em movimento. Edição criativa para Reels e TikTok que conquista atenção desde o primeiro segundo.',
    tags: 'REELS · TIKTOK',
  },
  {
    icon: PanelsTopLeft,
    title: 'Landing pages',
    description:
      'Uma experiência que leva à ação. Páginas claras, responsivas e focadas em transformar visitas em oportunidades.',
    tags: 'DESIGN · CONVERSÃO',
  },
];
const plans = [
  {
    name: 'Start',
    subtitle: 'Para começar com presença.',
    arts: 8,
    stories: 5,
    videos: 0,
    revisions: '2 revisões por arte',
    posting: false,
  },
  {
    name: 'Plus',
    subtitle: 'Para crescer com consistência.',
    arts: 16,
    stories: 8,
    videos: 2,
    revisions: '3 revisões por arte',
    posting: true,
  },
  {
    name: 'Prime',
    subtitle: 'Para ampliar suas possibilidades.',
    arts: 23,
    stories: 11,
    videos: 4,
    revisions: 'Revisões ilimitadas*',
    posting: true,
  },
];
const faqs = [
  [
    'O que é a Designário?',
    'Somos uma agência de design gráfico fundada em 2024. Reunimos gestão de redes sociais, identidade visual, vídeos, cardápios e landing pages em um único parceiro para a sua marca.',
  ],
  [
    'Como sei se é para a minha empresa?',
    'Se você precisa iniciar ou melhorar a presença visual da sua empresa, ganhar profissionalismo e atrair mais clientes, podemos ajudar. Trabalhamos com empresas de diferentes tamanhos e nichos.',
  ],
  [
    'Quais são as formas de pagamento?',
    'Aceitamos PIX e cartão. Os valores e as condições são apresentados no atendimento comercial. O cancelamento de planos mensais segue o aviso prévio estabelecido no contrato.',
  ],
  [
    'As artes criadas são minhas?',
    'Sim! Os direitos de uso das peças aprovadas e pagas são transferidos a você. O envio de arquivos editáveis depende do plano e é combinado na contratação.',
  ],
  [
    'Quando recebo as primeiras artes?',
    'Após o envio do briefing e dos materiais de base, o primeiro lote é entregue em até 5 dias úteis. O prazo pode variar conforme a complexidade do projeto e o envio dos materiais.',
  ],
];
const campaigns = ['/campanha-1.png', '/campanha-2.png'];
const nav = [
  ['Serviços', 'servicos'],
  ['Processo', 'processo'],
  ['Planos', 'planos'],
  ['Sobre nós', 'sobre'],
  ['Dúvidas', 'faq'],
];

function Promo() {
  const [step, setStep] = useState<number | null>(null);
  const [available, setAvailable] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    try {
      setStep(sessionStorage.getItem('designario-promos') ? 2 : 0);
    } catch {
      setStep(0);
    }
  }, []);
  useEffect(() => {
    if (step === null || step >= campaigns.length) return;
    let cancelled = false;
    const image = new window.Image();
    const timer = window.setTimeout(
      () => {
        image.onload = () => {
          if (cancelled) return;
          setAvailable(true);
          try {
            sessionStorage.setItem('designario-promos', 'seen');
          } catch {}
        };
        image.onerror = () => {
          if (!cancelled) setStep((value) => (value ?? 0) + 1);
        };
        image.src = campaigns[step];
      },
      step === 0 ? 30_000 : 600_000,
    );
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      image.onload = null;
      image.onerror = null;
    };
  }, [step]);
  function dismiss() {
    setAvailable(false);
    setOpen(false);
    setStep((value) => (value ?? 0) + 1);
  }
  return (
    <>
      {available && !open && (
        <aside
          className="campaign-invitation"
          aria-label="Destaque da Designário"
        >
          <Plus size={25} />
          <div>
            <p>Uma ideia para a sua marca.</p>
            <button type="button" onClick={() => setOpen(true)}>
              Ver destaque <ArrowUpRight size={15} />
            </button>
          </div>
          <button
            className="campaign-dismiss"
            onClick={dismiss}
            aria-label="Dispensar destaque"
          >
            <X size={17} />
          </button>
        </aside>
      )}
      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (!next) dismiss();
          else setOpen(true);
        }}
      >
        <DialogContent
          className="promo-dialog"
          showCloseButton={false}
          finalFocus={() =>
            document.querySelector<HTMLAnchorElement>('.whatsapp-float')
          }
        >
          <DialogTitle className="sr-only">Destaque da Designário</DialogTitle>
          <DialogDescription className="sr-only">
            Conheça a campanha e fale com nossa equipe pelo WhatsApp.
          </DialogDescription>
          <DialogClose className="promo-close" aria-label="Fechar promoção">
            <X size={22} />
          </DialogClose>
          <a
            href={whatsapp(
              'Olá! Quero saber mais sobre a campanha da Designário.',
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={campaigns[Math.min(step ?? 0, 1)]}
              alt="Campanha em destaque da Designário — consulte as condições pelo WhatsApp"
            />
          </a>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function Home() {
  usePageMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('');
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        }),
      { rootMargin: '-15% 0px -55% 0px' },
    );
    document
      .querySelectorAll('main section[id]')
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    type Tool = {
      name: string;
      description: string;
      inputSchema: object;
      annotations: object;
      execute: (input: unknown) => unknown;
    };
    const context = (
      document as Document & {
        modelContext?: {
          registerTool: (
            tool: Tool,
            options: { signal: AbortSignal },
          ) => void | Promise<void>;
        };
      }
    ).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    try {
      Promise.resolve(
        context.registerTool(
          {
            name: 'get_designario_plans',
            description:
              'Consultar os planos Start, Plus e Prime e seus links de orçamento. Não envia mensagens nem contrata serviços.',
            inputSchema: {
              type: 'object',
              properties: {},
              additionalProperties: false,
            },
            annotations: { readOnlyHint: true },
            execute: (input) => {
              if (
                !input ||
                typeof input !== 'object' ||
                Array.isArray(input) ||
                Object.keys(input).length
              )
                throw new Error('Use um objeto vazio.');
              return plans.map((p) => ({
                ...p,
                networks: 1,
                investment: 'Sob consulta',
                contact: whatsapp(
                  `Olá! Tenho interesse no plano ${p.name.toUpperCase()}.`,
                ),
              }));
            },
          },
          { signal: lifecycle.signal },
        ),
      ).catch(() => {});
    } catch {}
    return () => lifecycle.abort();
  }, []);
  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <header className="site-header">
        <div className="reading-progress" aria-hidden="true" />
        <a className="logo" href="#home" aria-label="Designário — início">
          <img
            className="brand-logo"
            src="/brand/logo-instagram.jpg"
            width="64"
            height="64"
            alt=""
          />
          <span className="brand-name">
            DESIGN<span>ÁRIO</span>
          </span>
        </a>
        <nav aria-label="Navegação principal">
          {nav.map(([label, id]) => (
            <a
              key={id}
              href={`#${id}`}
              className={active === id ? 'current' : ''}
              aria-current={active === id ? 'location' : undefined}
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <a
            className="nav-cta"
            href={whatsapp()}
            target="_blank"
            rel="noopener noreferrer"
          >
            Vamos conversar <ArrowUpRight size={17} />
          </a>
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger className="menu-button" aria-label="Abrir menu">
              <Menu />
            </SheetTrigger>
            <SheetContent showCloseButton={false} className="mobile-sheet">
              <SheetTitle>Explore a Designário</SheetTitle>
              <SheetDescription>
                Design, estratégia e presença.
              </SheetDescription>
              <SheetClose className="menu-close" aria-label="Fechar menu">
                <X />
              </SheetClose>
              <nav aria-label="Navegação no celular">
                {nav.map(([label, id]) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {label}
                    <ArrowUpRight />
                  </a>
                ))}
              </nav>
              <a
                className="button button-red"
                href={whatsapp()}
                target="_blank"
                rel="noopener noreferrer"
              >
                Solicitar orçamento
                <ArrowUpRight size={18} />
              </a>
            </SheetContent>
          </Sheet>
        </div>
      </header>
      <main id="conteudo">
        <section className="hero" id="home">
          <HeroMotion />
          <div className="hero-copy">
            <h1>
              <span className="hero-line">
                <span>Sua marca.</span>
              </span>
              <span className="hero-line">
                <span>Impossível</span>
              </span>
              <span className="hero-line">
                <span>
                  de <em>ignorar.</em>
                </span>
              </span>
            </h1>
            <p className="hero-description">
              Design, conteúdo e estratégia para transformar a sua marca em
              referência. Tudo em um só parceiro.
            </p>
            <div className="hero-actions">
              <a
                className="button button-red"
                href={whatsapp()}
                target="_blank"
                rel="noopener noreferrer"
              >
                Solicitar orçamento grátis <ArrowUpRight size={20} />
              </a>
              <a className="text-link" href="#servicos">
                Explore o que fazemos <ArrowDown size={16} />
              </a>
            </div>
          </div>
        </section>
        <section className="proof" aria-label="A Designário em números">
          <div className="proof-intro">
            <Plus aria-hidden="true" />
            <p>
              Design que conecta.
              <br />
              <strong>Parcerias que crescem.</strong>
            </p>
          </div>
          <div>
            <strong>
              300<span>+</span>
            </strong>
            <p>Empresas atendidas</p>
          </div>
          <div>
            <strong>
              02<span> anos</span>
            </strong>
            <p>De experiência em design</p>
          </div>
          <div>
            <strong>
              100<span>%</span>
            </strong>
            <p>Foco em visibilidade e ROI</p>
          </div>
        </section>
        <section className="section light" id="servicos">
          <div className="section-heading" data-reveal>
            <div>
              <p className="eyebrow">01 / O QUE FAZEMOS</p>
              <h2>
                Seu próximo nível
                <br />
                começa com <em>design.</em>
              </h2>
            </div>
            <p>
              Da primeira impressão ao próximo cliente.
              <br />
              Soluções criativas para sua marca ocupar
              <br className="desktop-break" /> o lugar que merece.
            </p>
          </div>
          <ServiceExplorer services={services} />
        </section>
        <div className="statement" aria-hidden="true">
          <div>
            {[0, 1].map((i) => (
              <span key={i}>
                DESIGN COM PROPÓSITO <Plus /> MARCAS COM PERSONALIDADE <Plus />{' '}
                IDEIAS EM MOVIMENTO <Plus />{' '}
              </span>
            ))}
          </div>
        </div>
        <Process />
        <section className="section plans" id="planos">
          <div className="section-heading" data-reveal>
            <div>
              <p className="eyebrow">03 / PLANOS QUE ACOMPANHAM VOCÊ</p>
              <h2>
                Seu momento.
                <br />
                <span className="muted-heading">Seu plano.</span>
              </h2>
            </div>
            <p>
              Mais consistência para sua presença digital.
              <br />
              Planos mensais, revisões inclusas e<br />
              um parceiro para chamar de seu.
            </p>
          </div>
          <PlanShowcase>
            {plans.map((p) => (
              <article
                className={`plan ${p.name === 'Plus' ? 'featured' : ''}`}
                key={p.name}
                data-reveal
              >
                {p.name === 'Plus' && (
                  <div className="plan-badge">
                    <Plus size={14} /> DESIGN + CONTEÚDO + GESTÃO
                  </div>
                )}
                <div className="plan-heading">
                  <h3>{p.name}</h3>
                  <ArrowUpRight size={25} />
                </div>
                <p className="plan-subtitle">{p.subtitle}</p>
                <div className="plan-volume">
                  {p.arts}
                  <span>artes / mês</span>
                </div>
                <ul>
                  <li>
                    <Check />1 rede social
                  </li>
                  <li>
                    <Check />
                    {p.stories} stories por mês
                  </li>
                  <li className={p.videos ? '' : 'unavailable'}>
                    {p.videos ? <Check /> : <span className="dash">—</span>}
                    {p.videos
                      ? `${p.videos} vídeos curtos por mês`
                      : 'Vídeos não inclusos'}
                  </li>
                  <li>
                    <Check />
                    {p.revisions}
                  </li>
                  <li className={p.posting ? '' : 'unavailable'}>
                    {p.posting ? <Check /> : <span className="dash">—</span>}
                    {p.posting
                      ? 'Gestão de postagem'
                      : 'Gestão de postagem não inclusa'}
                  </li>
                  <li>
                    <Check />
                    Atendimento pelo WhatsApp
                  </li>
                </ul>
                <div className="plan-investment">
                  <span>INVESTIMENTO MENSAL</span>
                  <strong>Sob consulta</strong>
                </div>
                <a
                  className={`button ${p.name === 'Plus' ? 'button-red' : 'button-outline'}`}
                  href={whatsapp(
                    `Olá! Tenho interesse no plano ${p.name.toUpperCase()}.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Quero o {p.name}
                  <ArrowUpRight size={19} />
                </a>
              </article>
            ))}
          </PlanShowcase>
          <p className="plan-note">
            *Revisões ilimitadas dentro do escopo do briefing inicial. Precisa
            de um projeto pontual?{' '}
            <a
              href={whatsapp(
                'Olá! Gostaria de um orçamento para um projeto pontual.',
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              Vamos conversar <ArrowUpRight size={13} />
            </a>
          </p>
        </section>
        <section className="section light about" id="sobre">
          <div className="about-art" data-reveal>
            <img
              src="/brand/monogram-relief.jpg"
              width="1254"
              height="1254"
              loading="lazy"
              alt="Tratamento em relevo do monograma da Designário, preto com detalhe vermelho"
            />
            <span className="about-art-top">DESIGNÁRIO / EST. 2024</span>
            <div className="about-art-caption">
              <Plus size={38} />
              <span>
                A boa ideia é só
                <br />o começo.
              </span>
            </div>
          </div>
          <div className="about-copy" data-reveal>
            <img
              className="about-lockup"
              src="/brand/lockup-light.jpg"
              width="2172"
              height="724"
              loading="lazy"
              alt="Designário"
            />
            <p className="eyebrow">04 / POR TRÁS DO DESIGN</p>
            <h2>
              Uma parceria.
              <br />
              Infinitas
              <br />
              <em>possibilidades.</em>
            </h2>
            <p>
              Somos a Designário. Desde 2024, conectamos design e estratégia
              para dar mais visibilidade às marcas.
            </p>
            <p>
              Centralize sua comunicação em um parceiro que entende o seu
              negócio e acompanha cada etapa do projeto.
            </p>
            <ul>
              {[
                'Design pensado para o seu nicho',
                'Equipe dedicada ao seu projeto',
                'Foco em ROI e crescimento sustentável',
                'Relatórios e acompanhamento contínuo',
              ].map((t) => (
                <li key={t}>
                  <Check size={17} />
                  {t}
                </li>
              ))}
            </ul>
            <a
              className="text-link dark-link"
              href={whatsapp(
                'Olá! Gostaria de falar com a equipe da Designário.',
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              Conheça sua próxima parceria
              <ArrowUpRight size={20} />
            </a>
          </div>
        </section>
        <section className="section light faq" id="faq">
          <div data-reveal>
            <p className="eyebrow">05 / SEM DÚVIDAS</p>
            <h2>
              Antes do
              <br />
              <em>próximo passo.</em>
            </h2>
            <p className="faq-intro">
              O que você precisa saber
              <br />
              para começar com confiança.
            </p>
          </div>
          <Accordion className="faq-list" data-reveal>
            {faqs.map(([question, answer], i) => (
              <AccordionItem key={question} value={`faq-${i}`}>
                <AccordionTrigger className="faq-trigger">
                  <span className="faq-number">0{i + 1}</span>
                  {question}
                </AccordionTrigger>
                <AccordionContent className="faq-answer">
                  <p>{answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
        <section className="contact" id="contato">
          <div className="contact-inner" data-reveal>
            <p className="eyebrow">GRANDES MARCAS COMEÇAM COM UMA CONVERSA.</p>
            <h2>
              Vamos fazer
              <br />
              <span>acontecer?</span>
            </h2>
            <div className="contact-bottom">
              <p>
                Sua próxima história de sucesso começa aqui.
                <br />
                Fale com a gente e receba um orçamento gratuito.
              </p>
              <a
                className="button button-white"
                href={whatsapp(
                  'Olá! Quero colocar minha marca em destaque com a Designário.',
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                Falar no WhatsApp
                <ArrowUpRight size={22} />
              </a>
            </div>
          </div>
          <span className="contact-brand-line" aria-hidden="true" />
        </section>
      </main>
      <footer className="footer">
        <div className="footer-main">
          <div>
            <a className="logo" href="#home">
              <img
                className="brand-logo"
                src="/brand/logo-instagram.jpg"
                width="64"
                height="64"
                alt=""
              />
              <span className="brand-name">
                DESIGN<span>ÁRIO</span>
              </span>
            </a>
            <p>
              Design, estratégia e resultados.
              <br />
              Em um só lugar.
            </p>
          </div>
          <div className="footer-nav">
            <span>EXPLORE</span>
            {nav.map(([label, id]) => (
              <a href={`#${id}`} key={id}>
                {label}
              </a>
            ))}
          </div>
          <div className="footer-contact">
            <span>VAMOS CONVERSAR</span>
            <a href="mailto:designarioatendimento@gmail.com">
              designarioatendimento@gmail.com
              <ArrowUpRight size={15} />
            </a>
            <a href={whatsapp()} target="_blank" rel="noopener noreferrer">
              +55 (15) 99633-7454
              <ArrowUpRight size={15} />
            </a>
            <p>Boas ideias são sempre bem-vindas.</p>
          </div>
        </div>
        <div className="footer-signature" aria-hidden="true">
          <img
            src="/brand/lockup-dark.jpg"
            width="2172"
            height="724"
            loading="lazy"
            alt=""
          />
        </div>
        <div className="footer-bottom">
          <MotionControl />
          <span>© 2026 Designário. Todos os direitos reservados.</span>
          <a href="#home">
            Voltar ao topo <ArrowUpRight size={14} />
          </a>
        </div>
      </footer>
      <a
        className="whatsapp-float"
        href={whatsapp()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar com a Designário no WhatsApp"
      >
        <MessageCircle size={24} />
        <span>Vamos conversar?</span>
      </a>
      <Promo />
    </>
  );
}
