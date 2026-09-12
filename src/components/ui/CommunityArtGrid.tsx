"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

export function CommunityArtGrid({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mobile = window.matchMedia("(width < 48rem), (hover: none)");
    const arts = Array.from(
      el.querySelectorAll<SVGSVGElement>(".pixel-clock, .pixel-clock-fast"),
    );
    const cleanups = arts.map((art) => {
      const tile = art.closest(".group");

      const play = () => {
        const animation = art.getAnimations()[0];
        if (!animation || !(animation.effect instanceof KeyframeEffect)) return;
        let time = animation.currentTime;
        if (!mobile.matches) {
          const duration = Number(
            animation.effect.getComputedTiming().duration,
          );
          const iteration = Math.floor(Number(time ?? 0) / duration);
          const clock = Number(
            getComputedStyle(art).getPropertyValue("--pixel-clock"),
          );
          const [, emptyHold, completeHold] = animation.effect.getKeyframes();
          if (clock === 0) {
            time =
              (iteration + (iteration % 2) + (emptyHold?.computedOffset ?? 0)) *
              duration;
          } else if (clock === 1) {
            time =
              (iteration +
                (1 - (iteration % 2)) +
                (1 - (completeHold?.computedOffset ?? 1))) *
              duration;
          }
        }
        animation.effect.updateTiming({ iterations: Infinity });
        animation.currentTime = time;
        animation.play();
      };

      const pause = () => {
        if (mobile.matches) return;
        const animation = art.getAnimations()[0];
        if (!animation) return;
        const duration = Number(animation.effect?.getComputedTiming().duration);
        if (Number(animation.currentTime ?? 0) < duration) return;
        const time =
          animation.playState === "finished"
            ? (animation.effect?.getComputedTiming().endTime ??
              animation.currentTime)
            : animation.currentTime;
        animation.pause();
        animation.currentTime = time;
      };

      const finishIntro = (event: AnimationEvent) => {
        art.removeAttribute("data-intro");
        if (mobile.matches || tile?.matches(":hover")) return;
        const animation = art.getAnimations()[0];
        if (!animation) return;
        const duration = Number(animation.effect?.getComputedTiming().duration);
        if (event.elapsedTime * 1000 > duration + 1) return;
        animation.pause();
        animation.currentTime = duration;
      };

      const updateMedia = () => {
        if (mobile.matches || tile?.matches(":hover")) play();
        else pause();
      };

      tile?.addEventListener("mouseenter", play);
      tile?.addEventListener("mouseleave", pause);
      art.addEventListener("animationend", finishIntro);
      art.addEventListener("animationiteration", finishIntro);
      mobile.addEventListener("change", updateMedia);

      return () => {
        tile?.removeEventListener("mouseenter", play);
        tile?.removeEventListener("mouseleave", pause);
        art.removeEventListener("animationend", finishIntro);
        art.removeEventListener("animationiteration", finishIntro);
        mobile.removeEventListener("change", updateMedia);
      };
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          for (const art of arts) {
            const animation = art.getAnimations()[0];
            if (!animation || !(animation.effect instanceof KeyframeEffect)) {
              continue;
            }
            const duration = Number(
              animation.effect.getComputedTiming().duration,
            );
            const [, emptyHold] = animation.effect.getKeyframes();
            const introStart = (emptyHold?.computedOffset ?? 0) * duration;
            if (Number(animation.currentTime ?? 0) < introStart) {
              animation.currentTime = introStart;
            }
          }
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px 80px 0px", threshold: 0 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return (
    <div
      ref={ref}
      data-visible={visible}
      className="community-art grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
    >
      {children}
    </div>
  );
}
