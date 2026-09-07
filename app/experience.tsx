'use client';
import { useCallback, useEffect, useRef, useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight, ArrowRight, Plus, Pause, Play } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';

type Service = {
  title: string;
  description: string;
  tags: string;
  icon: LucideIcon;
};
export function ServiceExplorer({ services }: { services: Service[] }) {
  const compact = useMedia('(max-width: 900px)');
  if (compact)
    return (
      <Accordion className="mobile-services" defaultValue={['0']}>
        {services.map((service, index) => (
          <AccordionItem key={service.title} value={String(index)}>
            <AccordionTrigger className="mobile-service-trigger">
              <span className="service-index">0{index + 1}</span>
              <span>{service.title}</span>
            </AccordionTrigger>
            <AccordionContent className="mobile-service-body">
              <service.icon size={38} strokeWidth={1.25} />
              <p>{service.description}</p>
              <div className="service-detail-tags">
                {service.tags.split(' · ').map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <a
                className="service-detail-cta"
                href={`https://wa.me/5515996337454?text=${encodeURIComponent(`Olá! Gostaria de um orçamento para ${service.title.toLowerCase()}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Conversar sobre este serviço <ArrowUpRight size={20} />
              </a>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
  return (
    <Tabs
      className="service-explorer"
      defaultValue="0"
      orientation={compact ? 'horizontal' : 'vertical'}
    >
      <TabsList className="service-menu" aria-label="Explore nossos serviços">
        {services.map((service, index) => (
          <TabsTrigger
            key={service.title}
            value={String(index)}
            className="service-option"
          >
            <span className="service-index">0{index + 1}</span>
            <span>{service.title}</span>
            <ArrowUpRight size={18} />
          </TabsTrigger>
        ))}
      </TabsList>
      <div className="service-panels">
        {services.map((service, index) => (
          <TabsContent
            key={service.title}
            value={String(index)}
            className="service-detail"
          >
            <div className="service-detail-top">
              <span>DESIGNÁRIO / SOLUÇÕES CRIATIVAS</span>
              <service.icon size={32} strokeWidth={1.3} />
            </div>
            <div className="service-detail-body">
              <span className="service-detail-number" aria-hidden="true">
                0{index + 1}
              </span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
            <div className="service-detail-tags">
              {service.tags.split(' · ').map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <a
              className="service-detail-cta"
              href={`https://wa.me/5515996337454?text=${encodeURIComponent(`Olá! Gostaria de um orçamento para ${service.title.toLowerCase()}.`)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Vamos falar sobre seu projeto
              <ArrowRight size={22} />
            </a>
          </TabsContent>
        ))}
        <span className="service-studio-mark" aria-hidden="true">
          <Plus /> ESTRATÉGIA QUE GANHA FORMA.
        </span>
      </div>
    </Tabs>
  );
}

export function PlanShowcase({ children }: { children: ReactNode[] }) {
  const compact = useMedia('(max-width: 900px)');
  if (!compact) return <div className="plans-grid">{children}</div>;
  return (
    <Tabs defaultValue="1" className="plan-selector">
      <TabsList className="plan-tabs" aria-label="Compare os planos">
        {['Start', 'Plus', 'Prime'].map((name, i) => (
          <TabsTrigger value={String(i)} key={name}>
            {name}
          </TabsTrigger>
        ))}
      </TabsList>
      {children.map((card, i) => (
        <TabsContent value={String(i)} key={i} className="plan-panel">
          {card}
        </TabsContent>
      ))}
    </Tabs>
  );
}

function useMedia(query: string) {
  const subscribe = useCallback(
    (notify: () => void) => {
      const media = window.matchMedia(query);
      media.addEventListener('change', notify);
      return () => media.removeEventListener('change', notify);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
function readPaused() {
  if (document.documentElement.dataset.motion)
    return document.documentElement.dataset.motion === 'paused';
  try {
    return sessionStorage.getItem('designario-motion-paused') === 'true';
  } catch {
    return false;
  }
}
function subscribePause(notify: () => void) {
  window.addEventListener('designario:motion', notify);
  return () => window.removeEventListener('designario:motion', notify);
}
export function MotionControl() {
  const paused = useSyncExternalStore(subscribePause, readPaused, () => false);
  const systemReduced = useMedia('(prefers-reduced-motion: reduce)');
  useEffect(() => {
    document.documentElement.dataset.motion = readPaused()
      ? 'paused'
      : 'playing';
    window.dispatchEvent(new Event('designario:motion'));
  }, []);
  function toggle(enabled: boolean) {
    document.documentElement.dataset.motion = enabled ? 'playing' : 'paused';
    try {
      sessionStorage.setItem('designario-motion-paused', String(!enabled));
    } catch {}
    window.dispatchEvent(new Event('designario:motion'));
  }
  return (
    <div
      className="motion-control"
      title={
        systemReduced
          ? 'Movimento reduzido nas preferências do seu sistema'
          : undefined
      }
    >
      <Switch
        id="motion-enabled"
        checked={!paused && !systemReduced}
        onCheckedChange={toggle}
        disabled={systemReduced}
      />
      <label htmlFor="motion-enabled">Animações</label>
    </div>
  );
}

// Decorative studio loop. Defer the download, respect motion preferences,
// and release decoding work when the hero or document is out of view.
export function HeroMotion() {
  const ref = useRef<HTMLVideoElement>(null);
  const paused = useSyncExternalStore(subscribePause, readPaused, () => false);
  const reduced = useMedia('(prefers-reduced-motion: reduce)');
  function toggle() {
    document.documentElement.dataset.motion = paused ? 'playing' : 'paused';
    try {
      sessionStorage.setItem('designario-motion-paused', String(!paused));
    } catch {}
    window.dispatchEvent(new Event('designario:motion'));
  }
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    let disposed = false;
    function sync() {
      if (disposed || !video) return;
      const stopped =
        reduced.matches || document.documentElement.dataset.motion === 'paused';
      if (stopped || !visible || document.hidden) {
        video.pause();
        return;
      }
      if (!video.getAttribute('src'))
        video.src = '/brand/designario-motion.mp4';
      void video.play().catch(() => {});
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { threshold: 0.05 },
    );
    observer.observe(video);
    reduced.addEventListener('change', sync);
    window.addEventListener('designario:motion', sync);
    document.addEventListener('visibilitychange', sync);
    return () => {
      disposed = true;
      observer.disconnect();
      reduced.removeEventListener('change', sync);
      window.removeEventListener('designario:motion', sync);
      document.removeEventListener('visibilitychange', sync);
      video.pause();
    };
  }, []);
  return (
    <div className="hero-art-stage">
      <video
        ref={ref}
        className="hero-video"
        width="720"
        height="720"
        poster="/brand/motion-poster.jpg"
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
      />
      {!reduced && (
        <button
          type="button"
          className="hero-motion-control"
          onClick={toggle}
          aria-label={
            paused
              ? 'Reproduzir animação do símbolo'
              : 'Pausar animação do símbolo'
          }
        >
          {paused ? <Play size={16} /> : <Pause size={16} />}
        </button>
      )}
    </div>
  );
}
