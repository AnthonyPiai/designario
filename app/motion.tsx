'use client';
import { useEffect } from 'react';
import {
  ArrowUpRight,
  MessageCircle,
  PenTool,
  CheckCheck,
  Send,
} from 'lucide-react';
import { timelineState } from './motion-math';

const stages = [
  {
    title: 'Primeiro, escutar.',
    label: 'CONVERSA & BRIEFING',
    text: 'Sua marca, seu momento e o que você quer comunicar. O briefing e os materiais de base dão direção ao projeto.',
    icon: MessageCircle,
    detail: 'Tudo começa com o seu negócio.',
  },
  {
    title: 'Dar forma à ideia.',
    label: 'DIREÇÃO & CRIAÇÃO',
    text: 'Identidade, conteúdo e formato se encontram. É aqui que a estratégia se transforma em uma linguagem visual para a sua marca.',
    icon: PenTool,
    detail: 'Intenção em cada escolha.',
  },
  {
    title: 'Afinar os detalhes.',
    label: 'REVISÃO & APROVAÇÃO',
    text: 'Você acompanha as peças e compartilha seu retorno. As revisões seguem o escopo do briefing e o plano contratado.',
    icon: CheckCheck,
    detail: 'Uma construção em parceria.',
  },
  {
    title: 'Colocar no mundo.',
    label: 'ENTREGA & PRESENÇA',
    text: 'Com as peças aprovadas, é hora de comunicar. A gestão de postagem e o acompanhamento seguem os serviços contratados.',
    icon: Send,
    detail: 'O design encontra as pessoas.',
  },
];

export function Process() {
  return (
    <section
      className="section process"
      id="processo"
      aria-labelledby="process-title"
    >
      <div className="process-intro">
        <p className="eyebrow">02 / DA CONVERSA À PRESENÇA</p>
        <h2 id="process-title">
          Boas ideias.
          <br />
          Um caminho
          <br />
          <em>bem pensado.</em>
        </h2>
        <p>
          Design é processo.
          <br />E você faz parte dele.
        </p>
        <div className="process-readout" aria-hidden="true">
          <span className="process-current">01</span>
          <span>/ 04</span>
        </div>
        <nav className="process-chapters" aria-label="Etapas do processo">
          {['Briefing', 'Criação', 'Revisão', 'Entrega'].map((name, index) => (
            <a
              className="process-step-link"
              href={`#etapa-${index + 1}`}
              key={name}
            >
              <span>0{index + 1}</span>
              {name}
              <ArrowUpRight size={14} />
            </a>
          ))}
        </nav>
      </div>
      <div className="process-story">
        <div className="process-rail" aria-hidden="true">
          <span />
        </div>
        <ol className="process-stages">
          {stages.map((stage, i) => (
            <li
              className="process-stage"
              id={`etapa-${i + 1}`}
              key={stage.label}
            >
              <span className="stage-marker" aria-hidden="true">
                0{i + 1}
              </span>
              <div className="stage-content">
                <div className="stage-top">
                  <span>{stage.label}</span>
                  <stage.icon size={26} strokeWidth={1.25} />
                </div>
                <h3>{stage.title}</h3>
                <p>{stage.text}</p>
                <span className="stage-detail">{stage.detail}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function usePageMotion() {
  useEffect(() => {
    const root = document.documentElement;
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointerQuery = window.matchMedia(
      '(hover: hover) and (pointer: fine) and (min-width: 900px)',
    );
    const reduced = () =>
      motionQuery.matches || root.dataset.motion === 'paused';
    const about = document.querySelector<HTMLElement>('.about-art');
    const process = document.querySelector<HTMLElement>('.process');
    const markers = [
      ...document.querySelectorAll<HTMLElement>('.stage-marker'),
    ];
    const stages = [
      ...document.querySelectorAll<HTMLElement>('.process-stage'),
    ];
    const chapters = [
      ...document.querySelectorAll<HTMLElement>('.process-step-link'),
    ];
    const rail = document.querySelector<HTMLElement>('.process-rail');
    const readout = document.querySelector<HTMLElement>('.process-current');
    const reveals = [
      ...document.querySelectorAll<HTMLElement>('[data-reveal]'),
    ];
    const revealObserver = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove('waiting');
            revealObserver.unobserve(entry.target);
          }
        }),
      { threshold: 0.07 },
    );
    if (!reduced())
      reveals.forEach((element, index) => {
        element.style.setProperty('--reveal-delay', `${(index % 3) * 65}ms`);
        if (element.getBoundingClientRect().top >= window.innerHeight) {
          element.classList.add('waiting');
          revealObserver.observe(element);
        }
      });
    let disposed = false;
    let frame = 0;
    let needsMeasure = true;
    let lastStage = -1;
    let previousReduced = false;
    let positions: number[] = [];
    let viewportHeight = window.innerHeight;
    let maxScroll = 1;
    let aboutMiddle = 0;
    const measure = () => {
      const y = window.scrollY;
      viewportHeight = window.innerHeight;
      positions = markers.map(
        (marker) =>
          marker.getBoundingClientRect().top + y + marker.offsetHeight / 2,
      );
      const aboutBox = about?.getBoundingClientRect();
      maxScroll = Math.max(1, root.scrollHeight - viewportHeight);
      aboutMiddle = (aboutBox?.top ?? 0) + y + (aboutBox?.height ?? 0) / 2;
      const firstMarker = markers[0];
      const lastMarker = markers.at(-1);
      const railTop = firstMarker
        ? firstMarker.offsetTop + firstMarker.offsetHeight / 2
        : 0;
      const railBottom = lastMarker
        ? stages.at(-1)!.offsetHeight -
          lastMarker.offsetTop -
          lastMarker.offsetHeight / 2
        : 0;
      if (rail) {
        rail.style.top = `${railTop}px`;
        rail.style.bottom = `${railBottom}px`;
      }
      needsMeasure = false;
    };
    const schedule = () => {
      if (!disposed && !frame) frame = requestAnimationFrame(render);
    };
    const render = () => {
      frame = 0;
      if (needsMeasure) measure();
      const paused = reduced();
      const desktop = pointerQuery.matches && !paused;
      const y = window.scrollY;
      const state = timelineState(positions, y + viewportHeight * 0.58);
      root.style.setProperty(
        '--reading-progress',
        String(Math.max(0, Math.min(1, y / maxScroll))),
      );
      process?.style.setProperty(
        '--process-progress',
        String(paused ? 1 : state.progress),
      );
      if (lastStage !== state.active || paused !== previousReduced) {
        stages.forEach((stage, index) => {
          stage.dataset.current = String(!paused && index === state.active);
          stage.dataset.passed = String(paused || index <= state.active);
        });
        chapters.forEach((chapter, index) => {
          if (index === state.active)
            chapter.setAttribute('aria-current', 'step');
          else chapter.removeAttribute('aria-current');
        });
        if (readout)
          readout.textContent = String(state.active + 1).padStart(2, '0');
        lastStage = state.active;
        previousReduced = paused;
      }
      about?.style.setProperty(
        '--about-drift',
        `${desktop ? Math.max(-25, Math.min(25, (y + viewportHeight / 2 - aboutMiddle) * 0.06)) : 0}px`,
      );
      if (paused)
        reveals.forEach((element) => element.classList.remove('waiting'));
    };
    const resize = () => {
      needsMeasure = true;
      schedule();
    };
    const preferences = () => {
      lastStage = -1;
      resize();
    };
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else {
        resize();
      }
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(document.body);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('designario:motion', preferences);
    document.addEventListener('visibilitychange', onVisibility);
    motionQuery.addEventListener('change', preferences);
    pointerQuery.addEventListener('change', preferences);
    void document.fonts.ready.then(resize, resize);
    schedule();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      revealObserver.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', resize);
      window.removeEventListener('designario:motion', preferences);
      document.removeEventListener('visibilitychange', onVisibility);
      motionQuery.removeEventListener('change', preferences);
      pointerQuery.removeEventListener('change', preferences);
      reveals.forEach((element) => element.classList.remove('waiting'));
    };
  }, []);
}
