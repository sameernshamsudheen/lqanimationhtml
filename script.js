document.addEventListener("DOMContentLoaded", () => {
  const lenisInstance = new Lenis({ smooth: true });

  gsap.registerPlugin(ScrollTrigger, SplitText);

  lenisInstance.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenisInstance.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  const spotlightImages = document.querySelector(".image_reveal_container");
  const headlineEls = document.querySelectorAll(
    ".headline-sequence .text_block"
  );
  const maskContainer = document.querySelector(".mask-container");
  const maskImage = document.querySelector(".imagereveal_banner");

  console.log(maskContainer, maskImage);
  window.addEventListener("load", () => {
    ScrollTrigger.create({
      trigger: ".image_revealsection",
      start: "top top",
      end: `+=${window.innerHeight * 7}px`,
      pin: true,
        pinSpacing:true,

      scrub:true,

      markers: false,

      onUpdate: (self) => {
        const progress = self.progress;
        console.log(progress);

        const headlineStart = 0.0;
        const headlineEnd = 0.5;
        const totalHeadlines = headlineEls.length;
        const perHeadline = (headlineEnd - headlineStart) / totalHeadlines;

        headlineEls.forEach((el, index) => {
          const start = headlineStart + index * perHeadline;
          const end = start + perHeadline;

          if (progress >= start && progress < end) {
            const localProgress = (progress - start) / perHeadline;

            let opacity = 0;
            if (localProgress < 0.3) {
              opacity = localProgress / 0.3; // fade in
            } else if (localProgress > 0.7) {
              opacity = (1 - localProgress) / 0.3; // fade out
            } else {
              opacity = 1; // fully visible
            }

            gsap.to(el, { opacity, duration: 0.1, ease: "power1.inOut" });
          } else {
            gsap.to(el, { opacity: 0, duration: 0.1, ease: "power1.inOut" });
          }
        });

        if (progress >= 0 && progress < 0.5) {
          const imageMoveProgress = progress / 0.5;
          const startY = 5;
          const endY = -100;
          const currentY = startY + (endY - startY) * imageMoveProgress;
          gsap.set(spotlightImages, { y: `${currentY}%` });
        } else if (progress >= 0.5) {
          gsap.set(spotlightImages, { y: `-100%` });
        }

        // === 2. Mask Animation (0.50 to 0.80)
        // === 2. Mask Animation (0.50 to 0.80)
        if (progress > 0.5 && progress < 0.8) {
          const maskProgress = (progress - 0.5) / 0.3;
          const maskSize = `${maskProgress * 450}%`;
          const imageScale = 1.5 - maskProgress * 0.5;

          maskContainer.style.setProperty("-webkit-mask-size", maskSize);
          maskContainer.style.setProperty("mask-size", maskSize);
          gsap.set(maskImage, { scale: imageScale });
        } else if (progress <= 0.5) {
          maskContainer.style.setProperty("-webkit-mask-size", "0%");
          maskContainer.style.setProperty("mask-size", "0%");
          gsap.set(maskImage, { scale: 1.5 });
        } else if (progress >= 0.8) {
          maskContainer.style.setProperty("-webkit-mask-size", "450%");
          maskContainer.style.setProperty("mask-size", "450%");
          gsap.set(maskImage, { scale: 1 });
        }

        // === 3. Final Header Word-by-Word (0.80 to 1.00)
      },
    });
  });
});
