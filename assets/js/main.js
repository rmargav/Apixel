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
        var style = $this.data("style") || "left";
        var clone = $this.data("clone") || 2;
        var speed = $this.data("speed") || 50;
        $this.infiniteslide({
          speed: speed,
          direction: style,
          clone: clone,
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
  /* Cursor Trail
    -------------------------------------------------------------------------*/
  var cursorTrail = () => {
    const canvas = document.getElementById("trail");
    const ctx = canvas.getContext("2d");
    let w = window.innerWidth,
      h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    let points = [];
    let ripples = [];

    window.addEventListener("resize", () => {
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

  /* Selected Work - Slick Controls
-------------------------------------------------------------------------*/
  var selectedWorkSlider = function () {
    var $nav = $(".slick-nav");
    var $images = $(".slick-for");
    var $tags = $(".work-tag li");

    if (!$nav.length || !$images.length || !$.fn.slick) {
      return;
    }

    /*
     * IMPORTANT:
     * If the template has already initialized Slick,
     * destroy both sliders first so we can initialize them
     * with our own desktop/mobile settings.
     */

    if ($nav.hasClass("slick-initialized")) {
      $nav.slick("unslick");
    }

    if ($images.hasClass("slick-initialized")) {
      $images.slick("unslick");
    }

    /*
     * TITLE SLIDER
     */
    $nav.slick({
      slidesToShow: 1,
      slidesToScroll: 1,

      arrows: false,
      dots: false,

      autoplay: true,
      autoplaySpeed: 8000, // 6 seconds
      speed: 800, // transition speed

      infinite: true,
      adaptiveHeight: false,

      asNavFor: ".slick-for",

      responsive: [
        {
          breakpoint: 767,
          settings: {
            slidesToShow: 1,
            autoplay: true,
            autoplaySpeed: 8000,
            speed: 700,
          },
        },
      ],
    });

    /*
     * IMAGE SLIDER
     */
    $images.slick({
      slidesToShow: 1,
      slidesToScroll: 1,

      arrows: false,
      dots: false,

      autoplay: true,
      autoplaySpeed: 8000, // 6 seconds
      speed: 800,

      infinite: true,

      adaptiveHeight: false,

      asNavFor: ".slick-nav",

      responsive: [
        {
          breakpoint: 767,
          settings: {
            slidesToShow: 1,
            autoplay: true,
            autoplaySpeed: 8000,
            speed: 700,
          },
        },
      ],
    });

    /* -----------------------------------------
   PROJECT TAGS
----------------------------------------- */

    function updateTags(index) {
      $tags.removeClass("active");
      $tags.eq(index).addClass("active");
    }

    /* Show first project's tags */
    updateTags(0);

    /* Change tags when image changes */
    $images.on("afterChange", function (event, slick, currentSlide) {
      updateTags(currentSlide);
    });

    /*
     * PREV / NEXT BUTTONS
     */
    $(".nav-prev-swiper")
      .off("click")
      .on("click", function () {
        $images.slick("slickPrev");
      });

    $(".nav-next-swiper")
      .off("click")
      .on("click", function () {
        $images.slick("slickNext");
      });

    /*
     * UPDATE YEAR
     */
    function updateYear(index) {
      var slide = $nav.find(".slick-slide[data-slick-index='" + index + "']");

      /*
       * Because Slick creates cloned slides,
       * fallback to the actual slide if needed.
       */
      if (!slide.length) {
        slide = $nav.find(".slick-slide.slick-current");
      }

      var year = slide.attr("data-year");

      if (!year) {
        year = "2024";
      }

      $("#dynamic-project-year").html(
        year.substring(0, 2) +
          '<span class="text-primary">' +
          year.substring(2, 4) +
          "</span>",
      );
    }

    /*
     * Initial year
     */
    updateYear(0);

    /*
     * Update year whenever image/title changes
     */
    $images.on("afterChange", function (event, slick, currentSlide) {
      updateYear(currentSlide);
    });
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
  });
})(jQuery);
