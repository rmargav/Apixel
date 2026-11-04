/**
 * Go Top
 * Infinite Slide
 * Update Clock
 * Cursor Trail
 * Counter
 * Scroll Link
 * Setting Color
 * Open Menu
 * Click Active
 * Selected Work Slider (High Performance)
 * Show Team Section
 */

(function ($) {
  "use strict";

  /* Go Top
    -------------------------------------------------------------------------*/
  var goTop = function () {
    var $goTop = $("#goTop");
    var $borderProgress = $(".border-progress");
    var $footer = $(".tf-footer");

    $(window).on("scroll", function () {
      var scrollTop = $(window).scrollTop();
      var docHeight = $(document).height() - $(window).height();
      var scrollPercent = (scrollTop / docHeight) * 100;
      var progressAngle = (scrollPercent / 100) * 360;

      $borderProgress.css("--progress-angle", progressAngle + "deg");

      var windowBottom = scrollTop + $(window).height();
      var hasFooter = $footer.length > 0;
      var footerOffset = hasFooter ? $footer.offset().top : Infinity;

      if (scrollTop > 100 && windowBottom < footerOffset) {
        $goTop.addClass("show");
      } else {
        $goTop.removeClass("show");
      }
    });

    $goTop.on("click", function () {
      $("html, body").animate({ scrollTop: 0 }, 100);
    });
  };

  /* Infinite Slide 
    -------------------------------------------------------------------------*/
  var infiniteSlide = function () {
    if ($(".infiniteSlide").length > 0) {
      $(".infiniteSlide").each(function () {
        var $this = $(this);

        if (typeof $.fn.infiniteslide !== "function") {
          console.error("InfiniteSlide plugin not loaded");
          return;
        }

        $this.infiniteslide({
          speed: 50,
          direction: "left",
          clone: 3,
          pauseonhover: false,
        });
      });
    }
  };

  /* Update Clock
    -------------------------------------------------------------------------*/
  var updateClock = () => {
    function startClocks(selector = ".clock") {
      function updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString("en-GB");
        document.querySelectorAll(selector).forEach((el) => {
          el.textContent = timeString;
        });
      }
      updateClock();
      setInterval(updateClock, 1000);
    }

    startClocks(".clock");
  };

  /* Cursor Trail (Mobile CPU Fix Applied)
    -------------------------------------------------------------------------*/
  var cursorTrail = () => {
    // ONLY RUN ON DESKTOP - Do not run heavy canvas on mobile touch devices
    if (window.innerWidth <= 1024 || "ontouchstart" in window) {
      return;
    }

    const canvas = document.getElementById("trail");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = window.innerWidth,
      h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    let points = [];
    let ripples = [];

    window.addEventListener("resize", () => {
      if (window.innerWidth <= 1024) return;
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    });

    window.addEventListener("mousemove", (e) => {
      points.push({ x: e.clientX, y: e.clientY });
      if (points.length > 10) points.shift();
    });

    window.addEventListener("click", (e) => {
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        alpha: 1,
      });
    });

    function draw() {
      ctx.clearRect(0, 0, w, h);

      if (points.length > 1) {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        let last = points[points.length - 1];
        let grad = ctx.createLinearGradient(
          points[0].x,
          points[0].y,
          last.x,
          last.y,
        );
        grad.addColorStop(0, "black");
        grad.addColorStop(1, "white");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.stroke();
      }

      ripples.forEach((r, i) => {
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,255,255,${r.alpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        r.radius += 1;
        r.alpha -= 0.02;
      });
      ripples = ripples.filter((r) => r.alpha > 0);

      requestAnimationFrame(draw);
    }
    draw();
  };

  /* Counter Odo
    -------------------------------------------------------------------------*/
  var counterOdo = () => {
    function isElementInViewport($el) {
      var top = $el.offset().top;
      var bottom = top + $el.outerHeight();
      var viewportTop = $(window).scrollTop();
      var viewportBottom = viewportTop + $(window).height();
      return bottom > viewportTop && top < viewportBottom;
    }
    if ($(".counter-scroll").length > 0) {
      $(window).on("scroll", function () {
        $(".wg-counter").each(function () {
          var $counter = $(this);
          if (isElementInViewport($counter) && !$counter.hasClass("counted")) {
            $counter.addClass("counted");
            var targetNumber = $counter.find(".odometer").data("number");
            setTimeout(function () {
              $counter.find(".odometer").text(targetNumber);
            }, 0);
          }
        });
      });
    }
  };

  /* Setting Color
    -------------------------------------------------------------------------*/
  const settingColor = () => {
    if (!$(".settings-color").length) return;

    const COLOR_KEY = "selectedColorIndex";

    const savedIndex = localStorage.getItem(COLOR_KEY);

    if (savedIndex !== null) {
      setColor(savedIndex);
      setActiveItem(savedIndex - 1);
    }

    $(".choose-item").on("click", function () {
      const index = $(this).index();
      setColor(index + 1);
      setActiveItem(index);
      localStorage.setItem(COLOR_KEY, index + 1);
    });

    function setColor(index) {
      $("body").attr("data-color-primary", "color-primary-" + index);
    }

    function setActiveItem(index) {
      $(".choose-item").removeClass("active").eq(index).addClass("active");
    }
  };

  /* Open Menu
    -------------------------------------------------------------------------*/
  var openMbMenu = () => {
    $(".open-mb-menu").on("click", function () {
      $(".offcanvas-menu").addClass("show");
      $("body").toggleClass("overflow-hidden");
    });

    $(".close-mb-menu").on("click", function () {
      $(".offcanvas-menu").removeClass("show");
      $("body").toggleClass("overflow-hidden");
    });
  };

  /* Click Active
    -------------------------------------------------------------------------*/
  var clickActive = () => {
    $(".btn-active").on("mouseenter", function () {
      var $btn = $(this);
      if ($btn.hasClass("active")) {
      } else {
        $(".main-action-active .btn-active").removeClass("active");
        $btn.addClass("active");
      }
    });
  };

  /* Selected Work - Custom High-Performance Swapper (Mobile Crash Fix)
    -------------------------------------------------------------------------*/
  var selectedWorkSlider = function () {
    // Array holding all 17 projects
    var projects = [
      {
        title: "Toxic",
        year: "2026",
        src: "assets/images/section/001 Toixc.jpg",
      },
      {
        title: "Dhurandhar The Revange",
        year: "2026",
        src: "assets/images/section/002vDR2.jpg",
      },
      {
        title: "Dhurandhar",
        year: "2025",
        src: "assets/images/section/003 DR.jpg",
      },
      {
        title: "Kartavya",
        year: "2026",
        src: "assets/images/section/004 KTY.jpg",
      },
      {
        title: "Pushpa 2",
        year: "2024",
        src: "assets/images/section/005 001 PUSHPA.jpg",
      },
      {
        title: "Animal",
        year: "2023",
        src: "assets/images/section/005 ANImal.jpg",
      },
      {
        title: "Bhola Shankar",
        year: "2023",
        src: "assets/images/section/006 Bhola shankar.jpg",
      },
      {
        title: "AdiPurush",
        year: "2023",
        src: "assets/images/section/007 ADIpurush.jpg",
      },
      {
        title: "Shiddat",
        year: "2021",
        src: "assets/images/section/008 001 SD.jpg",
      },
      {
        title: "Abeer Gulaal",
        year: "2025",
        src: "assets/images/section/008 002 AG.jpg",
      },
      {
        title: "An Action Hero",
        year: "2022",
        src: "assets/images/section/008 Action hero.jpg",
      },
      {
        title: "Heropanti 2",
        year: "2022",
        src: "assets/images/section/009 001 HP2.jpg",
      },
      {
        title: "Bajao",
        year: "2023",
        src: "assets/images/section/009 Bajao.jpg",
      },
      {
        title: "Neeyat",
        year: "2023",
        src: "assets/images/section/010 Neeyat.jpg",
      },
      {
        title: "Operation Mayfair",
        year: "2023",
        src: "assets/images/section/011 Opration may fair.jpg",
      },
      {
        title: "Sergeant",
        year: "2023",
        src: "assets/images/section/012 Sergeant.jpg",
      },
      {
        title: "Hustlers",
        year: "2024",
        src: "assets/images/section/013 Hustler.jpg",
      },
    ];

    var currentIndex = 0;
    var $title = $("#dynamic-title");
    var $image = $("#dynamic-image");
    var $year = $("#dynamic-project-year");
    var $tags = $("#dynamic-tags li");
    var autoPlayTimer;
    var preloadedImages = {}; // Cache to hold preloaded images

    // Preload function to prevent delay on click
    function preloadImage(index) {
      if (!preloadedImages[index]) {
        var img = new Image();
        img.src = projects[index].src;
        preloadedImages[index] = img;
      }
    }

    function updateDOM(index) {
      var project = projects[index];

      // Brief opacity fade for a smooth switch without animation lag
      $title.css("opacity", 0);
      $image.css("opacity", 0);

      setTimeout(function () {
        // Update Text
        $title.text(project.title);
        $image.attr("src", project.src);
        $image.attr("alt", project.title);

        // Format Year
        var firstHalf = project.year.substring(0, 2);
        var secondHalf = project.year.substring(2, 4);
        $year.html(
          firstHalf + '<span class="text-primary">' + secondHalf + "</span>",
        );

        // Update Tag
        $tags.removeClass("active");
        $tags.eq(index).addClass("active");

        // Fade back in
        $title.css("opacity", 1);
        $image.css("opacity", 1);
      }, 150);

      // Preload the next image so it is ready instantly
      var nextIndex = (index + 1) % projects.length;
      preloadImage(nextIndex);
    }

    function nextSlide() {
      currentIndex = (currentIndex + 1) % projects.length;
      updateDOM(currentIndex);
    }

    function prevSlide() {
      currentIndex = (currentIndex - 1 + projects.length) % projects.length;
      updateDOM(currentIndex);
    }

    function startAutoPlay() {
      clearInterval(autoPlayTimer);
      autoPlayTimer = setInterval(nextSlide, 6000); // 6 seconds
    }

    // Button Clicks
    $("#btn-next-work")
      .off("click")
      .on("click", function () {
        nextSlide();
        startAutoPlay(); // Reset timer on manual click
      });

    $("#btn-prev-work")
      .off("click")
      .on("click", function () {
        prevSlide();
        startAutoPlay();
      });

    // Init
    if ($title.length && $image.length) {
      preloadImage(1); // Preload image 2 immediately
      startAutoPlay();
    }
  };

  /* Lightweight Services Slider (High Performance)
    -------------------------------------------------------------------------*/
  var lightweightServicesSlider = function () {
    if ($("#serviceScroll").length === 0) return;

    var servicesData = [
      {
        // 01
        title: "VFX & CGI",
        desc: "Seamless compositing, green screen removal, and clean-ups to 3D modelling, animation, CGI evironments, and realistic product visuals.",
        bg: "assets/images/section/Services_bg_001.jpg",
        main: "assets/images/section/VFX  CGI.jpeg",
        next: "assets/images/section/Animation  Motion Design.jpeg",
        features: [
          "VFX",
          "Compositing",
          "Roto & Paint",
          "3D & CGI",
          "Matte Painting & FX",
        ],
      },
      {
        // 02
        title: "Animation & Motion Design",
        desc: "Turning ideas, messages, and visuals into movement that holds attention. From 2D and 3D animation to motion graphics, title sequences, and animated explainers.",
        bg: "assets/images/section/Services_bg_002.jpg",
        main: "assets/images/section/Animation  Motion Design.jpeg",
        next: "assets/images/section/Film  Video Production.jpeg",
        features: [
          "2D / 3D Animation",
          "Motion Graphics",
          "Titles",
          "Explainers",
          "Brand Animation",
        ],
      },
      {
        // 03
        title: "Film & Video Production",
        desc: "From the first idea to the final shot, we help bring your vision to life on screen.",
        bg: "assets/images/section/Services_bg_003.jpg",
        main: "assets/images/section/Film  Video Production.jpeg",
        next: "assets/images/section/Post-Production.jpeg",
        features: [
          "Film Production",
          "Ad Films",
          "Brand Films",
          "Music Videos",
          "AI Films",
        ],
      },
      {
        // 04
        title: "Post-Production",
        desc: "We bring footage together through editing, colour grading, sound design, visual effects, and finishing to create a seamless final film.",
        bg: "assets/images/section/Services_bg_001.jpg",
        main: "assets/images/section/Post-Production.jpeg",
        next: "assets/images/section/AI Creative Studio.jpeg",
        features: ["Editing", "Colour", "VFX", "Finishing", "Mastering & QC"],
      },
      {
        // 05
        title: "AI Creative Studio",
        desc: "With the use of AI as a creative tool, we help brands and filmmakers explore new possibilities, speed up ideation, and create distinctive content while keeping the original vision at the centre.",
        bg: "assets/images/section/Services_bg_002.jpg",
        main: "assets/images/section/AI Creative Studio.jpeg",
        next: "assets/images/section/DCP  Mastering.jpeg",
        features: [
          "AI Filmmaking",
          "AI Animation",
          "AI VFX",
          "Generative Content",
          "AI Commercials",
        ],
      },
      {
        // 06
        title: "DCP & Mastering",
        desc: "We provide Digital Cinema Package (DCP) creation, mastering, format conversion, and delivery preparation to help ensure your content meets the technical requirements of its intended platform.",
        bg: "assets/images/section/Services_bg_003.jpg",
        main: "assets/images/section/DCP  Mastering.jpeg",
        next: "assets/images/section/Virtual Production.jpeg",
        features: ["DCP", "2K / 4K Masters", "OTT Delivery", "Broadcast", "QC"],
      },
      {
        // 07
        title: "Virtual Production",
        desc: "Whether you need a location that doesn’t exist or greater creative control over a shoot, we help bring the environment to you while making the most of your production time and resources.",
        bg: "assets/images/section/Services_bg_001.jpg",
        main: "assets/images/section/Virtual Production.jpeg",
        next: "assets/images/section/Design  Branding.jpeg",
        features: ["Virtual Sets", "Green Screen", "XR", "Real-Time CGI"],
      },
      {
        // 08
        title: "Design & Branding",
        desc: "We create brand identities, logos, campaign visuals, key art, and digital designs that reflect your personality and communicate what sets you apart.",
        bg: "assets/images/section/Services_bg_003.jpg",
        main: "assets/images/section/Design  Branding.jpeg",
        next: "assets/images/section/VFX  CGI.jpeg", // Loops back to the first one
        features: [
          "Graphic Design",
          "Posters",
          "Key Visuals",
          "Branding",
          "Digital Campaigns",
        ],
      },
    ];

    var currentIndex = 0;
    var timer;
    var $bgContainer = $("#dyn-srv-bg-container");
    var $bgImg = $("#dyn-srv-bg");
    var $mainContainer = $("#dyn-srv-main-container");
    var $mainImg = $("#dyn-srv-main-img");
    var $thumbContainer = $("#dyn-srv-thumb-container");
    var $thumbImg = $("#dyn-srv-thumb");
    var $textContainer = $("#dyn-srv-text-container");
    var $title = $("#dyn-srv-title");
    var $desc = $("#dyn-srv-desc");
    var $features = $("#dyn-srv-features");

    function preload(index) {
      var nextImg = new Image();
      nextImg.src = servicesData[index].main;
    }

    function updateServiceDOM(index) {
      var data = servicesData[index];

      // Fade out
      $bgContainer.css("opacity", 0);
      $mainContainer.css("opacity", 0);
      $thumbContainer.css("opacity", 0);
      $textContainer.css("opacity", 0);

      setTimeout(function () {
        // Update values
        $bgImg.attr("src", data.bg);
        $mainImg.attr("src", data.main);
        $thumbImg.attr("src", data.next);
        $title.text(data.title);
        $desc.text(data.desc);

        var featuresHtml = "";
        for (var i = 0; i < data.features.length; i++) {
          featuresHtml +=
            '<li class="letter-space--1"><span class="text-primary">//</span> ' +
            data.features[i] +
            "</li>";
        }
        $features.html(featuresHtml);

        // Fade back in
        $bgContainer.css("opacity", 1);
        $mainContainer.css("opacity", 1);
        $thumbContainer.css("opacity", 1);
        $textContainer.css("opacity", 1);
      }, 300);

      preload((index + 1) % servicesData.length);
    }

    function autoSlide() {
      currentIndex = (currentIndex + 1) % servicesData.length;
      updateServiceDOM(currentIndex);
    }

    function resetTimer() {
      clearInterval(timer);
      timer = setInterval(autoSlide, 8000); // 8 seconds
    }

    // Button Clicks (Now targeting both Desktop and Mobile buttons)
    $("#btn-srv-next, #btn-srv-next-mob")
      .off("click")
      .on("click", function (e) {
        e.preventDefault();
        currentIndex = (currentIndex + 1) % servicesData.length;
        updateServiceDOM(currentIndex);
        resetTimer();
      });

    $("#btn-srv-prev, #btn-srv-prev-mob")
      .off("click")
      .on("click", function (e) {
        e.preventDefault();
        currentIndex =
          (currentIndex - 1 + servicesData.length) % servicesData.length;
        updateServiceDOM(currentIndex);
        resetTimer();
      });

    preload(1);
    resetTimer();
  };

  /* Show Team Section
    -------------------------------------------------------------------------*/
  var showTeamSection = function () {
    $("#show-team-btn").on("click", function (e) {
      e.preventDefault();
      var $teamSection = $("#teamScroll");

      // Slide the section down over 600ms
      $teamSection.slideDown(600, function () {
        // Refresh GSAP ScrollTrigger so animations inside the team section work
        if (typeof ScrollTrigger !== "undefined") {
          ScrollTrigger.refresh();
        }

        // Smooth scroll down to the newly opened section
        $("html, body").animate(
          {
            scrollTop: $teamSection.offset().top - 80,
          },
          800,
        );
      });
    });
  };

  /* Deferred Video Loading (Fixes Long Initial Load Time)
    -------------------------------------------------------------------------*/
  var initLazyVideos = function () {
    // 1. Load Hero Video
    var heroVid = document.getElementById("hero-video");
    if (heroVid) {
      heroVid.innerHTML =
        '<source src="assets/images/video/corridor.webm" type="video/webm">';
      heroVid.load();
    }

    // 2. Load About Us Video
    var aboutVid = document.getElementById("about-video");
    if (aboutVid) {
      aboutVid.innerHTML =
        '<source src="assets/images/video/Video.mp4" type="video/mp4">';
      aboutVid.load();
    }
  };

  /* Dom Ready
    -------------------------------------------------------------------------*/
  $(function () {
    infiniteSlide();
    updateClock();
    cursorTrail();
    goTop();
    counterOdo();
    openMbMenu();
    clickActive();
    selectedWorkSlider();
    lightweightServicesSlider();
    showTeamSection();
    initLazyVideos();
  });
})(jQuery);
