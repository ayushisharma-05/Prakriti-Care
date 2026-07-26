/* 
  Prakriti Care - Core JS Engine
  Features: Canvas Particle Backdrop, 3D Telemetry Card Tilt, Scroll Reveals, Count-ups, 
            Leaflet Map with filter overlays, Live Rescue Tracker, Drag & Drop Upload, and Form validation.
*/

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lucide Icons
  lucide.createIcons();

  // Sounds
  const successSound = document.getElementById("success-sound");

  const playSuccessSound = () => {
    if (successSound) {
      successSound.volume = 0.5;
      successSound.currentTime = 0;
      successSound.play().catch(e => console.log("Sound play delayed/blocked by browser policy"));
    }
  };

  /* ----------------------------------------------------
     1. Sticky Navigation Header & Scroll Reveals
     ---------------------------------------------------- */
  const header = document.querySelector(".main-header");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section, footer");

  window.addEventListener("scroll", () => {
    // Header Sticky
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    // Active Link Highlighting
    let current = "";
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 150)) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href").includes(current)) {
        link.classList.add("active");
      }
    });
  });

  // Reveal animations on scroll
  const revealElements = document.querySelectorAll(".reveal");
  const revealOnScroll = () => {
    const triggerBottom = window.innerHeight * 0.85;
    revealElements.forEach(el => {
      const elTop = el.getBoundingClientRect().top;
      if (elTop < triggerBottom) {
        el.classList.add("active");
      }
    });
  };
  window.addEventListener("scroll", revealOnScroll);
  // Initial run
  revealOnScroll();

  /* ----------------------------------------------------
     2. Mobile Overlay Navigation
     ---------------------------------------------------- */
  const mobileNavToggle = document.querySelector(".mobile-nav-toggle");
  const mobileOverlay = document.querySelector(".mobile-nav-overlay");
  const mobileLinks = document.querySelectorAll(".mobile-link");
  const menuIcon = document.getElementById("menu-icon");

  const toggleMobileNav = () => {
    mobileOverlay.classList.toggle("open");
    const isOpen = mobileOverlay.classList.contains("open");
    menuIcon.setAttribute("data-lucide", isOpen ? "x" : "menu");
    lucide.createIcons();
    document.body.style.overflow = isOpen ? "hidden" : "";
  };

  mobileNavToggle.addEventListener("click", toggleMobileNav);
  
  mobileLinks.forEach(link => {
    link.addEventListener("click", () => {
      if (mobileOverlay.classList.contains("open")) {
        toggleMobileNav();
      }
    });
  });

  /* ----------------------------------------------------
     3. Immersive Nature Ambient Particles (Canvas)
     ---------------------------------------------------- */
  const canvas = document.getElementById("nature-canvas");
  const ctx = canvas.getContext("2d");

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Particle Classes
  class LeafParticle {
    constructor() {
      this.reset();
      this.y = Math.random() * height; // initial random spread
    }

    reset() {
      this.x = Math.random() * width;
      this.y = -20;
      this.size = Math.random() * 8 + 6;
      this.speedX = Math.random() * 0.8 - 0.2; // drifting right/left
      this.speedY = Math.random() * 1 + 0.6;   // falling down
      this.rotation = Math.random() * Math.PI;
      this.rotationSpeed = Math.random() * 0.02 - 0.01;
      this.opacity = Math.random() * 0.4 + 0.15;
      
      // Different shades of nature greens
      const greenColors = ["#1B4D3E", "#2a6a57", "#3d8e75", "#8fbc8f"];
      this.color = greenColors[Math.floor(Math.random() * greenColors.length)];
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.rotation += this.rotationSpeed;

      // Reset leaf if it goes offscreen
      if (this.y > height + 20 || this.x > width + 20 || this.x < -20) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      
      // Draw a organic leaf shape
      ctx.beginPath();
      ctx.moveTo(0, -this.size);
      ctx.quadraticCurveTo(this.size * 0.6, -this.size * 0.3, 0, this.size);
      ctx.quadraticCurveTo(-this.size * 0.6, -this.size * 0.3, 0, -this.size);
      ctx.fill();
      
      // Leaf middle vein
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, -this.size);
      ctx.lineTo(0, this.size);
      ctx.stroke();

      ctx.restore();
    }
  }

  class SunbeamMote {
    constructor() {
      this.reset();
      this.y = Math.random() * height;
    }

    reset() {
      this.x = Math.random() * width;
      this.y = height + Math.random() * 20;
      this.size = Math.random() * 4 + 1;
      this.speedX = Math.random() * 0.3 - 0.15;
      this.speedY = -(Math.random() * 0.5 + 0.3); // rising slowly
      this.opacity = Math.random() * 0.3 + 0.1;
      this.glow = Math.random() * 10 + 5;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.y < -10 || this.x < -10 || this.x > width + 10) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.shadowBlur = this.glow;
      ctx.shadowColor = "#D97706";
      ctx.fillStyle = "#f3e5ab";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  const leaves = Array.from({ length: 28 }, () => new LeafParticle());
  const motes = Array.from({ length: 40 }, () => new SunbeamMote());

  const animateParticles = () => {
    ctx.clearRect(0, 0, width, height);

    // Draw ambient lighting rays (subtle yellow/green gradients)
    const rayGrad = ctx.createLinearGradient(0, 0, width, height);
    rayGrad.addColorStop(0, "rgba(27, 77, 62, 0.05)");
    rayGrad.addColorStop(0.5, "rgba(217, 119, 6, 0.02)");
    rayGrad.addColorStop(1, "rgba(10, 31, 25, 0.05)");
    ctx.fillStyle = rayGrad;
    ctx.fillRect(0, 0, width, height);

    // Update & draw motes
    motes.forEach(mote => {
      mote.update();
      mote.draw();
    });

    // Update & draw leaves
    leaves.forEach(leaf => {
      leaf.update();
      leaf.draw();
    });

    requestAnimationFrame(animateParticles);
  };
  animateParticles();

  /* ----------------------------------------------------
     4. Interactive 3D Card Hover Effect
     ---------------------------------------------------- */
  const telemetryCard = document.querySelector(".telemetry-card");

  if (telemetryCard) {
    telemetryCard.addEventListener("mousemove", (e) => {
      const rect = telemetryCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const cardWidth = rect.width;
      const cardHeight = rect.height;
      
      const rotateY = ((x / cardWidth) - 0.5) * 20; // max 10 degrees tilt Y
      const rotateX = (((y / cardHeight) - 0.5) * -20); // max 10 degrees tilt X
      
      telemetryCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      telemetryCard.style.boxShadow = `${-rotateY * 1.5}px ${rotateX * 1.5}px 35px rgba(0,0,0,0.5)`;
    });

    telemetryCard.addEventListener("mouseleave", () => {
      telemetryCard.style.transform = "rotateX(0deg) rotateY(0deg) translateY(0px)";
      telemetryCard.style.boxShadow = "var(--glass-shadow)";
    });
  }

  /* ----------------------------------------------------
     5. Live Impact Metrics Viewport Count-Up
     ---------------------------------------------------- */
  const counters = document.querySelectorAll(".counter");
  let countsAnimated = false;

  const countUp = () => {
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute("data-target"), 10);
      const duration = 2500; // 2.5s
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        // Quadratic ease-out formula
        const easeProgress = progress * (2 - progress);
        const currentValue = Math.floor(easeProgress * target);
        
        counter.textContent = currentValue.toLocaleString("en-US");

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target.toLocaleString("en-US");
        }
      };

      requestAnimationFrame(updateCounter);
    });
  };

  const checkMetricsVisibility = () => {
    if (countsAnimated) return;
    const section = document.getElementById("impact");
    if (!section) return;
    
    const rect = section.getBoundingClientRect();
    const isVisible = rect.top < (window.innerHeight * 0.85);

    if (isVisible) {
      countUp();
      countsAnimated = true;
    }
  };

  window.addEventListener("scroll", checkMetricsVisibility);
  checkMetricsVisibility();

  /* ----------------------------------------------------
     6. Leaflet Map setup (Real-Time Rescue telemetry)
     ---------------------------------------------------- */
  const mapElement = document.getElementById("leaflet-map");
  let mapInstance;
  let markersLayer = L.layerGroup();

  // Mock telemetry datasets — Pan-India Network
  const mapLocations = [
    // ---- MADHYA PRADESH ----
    { id: 1, type: "rescue", title: "Injured Indian Peafowl", desc: "Reported: Wing injury, Vijay Nagar, Indore", coords: [22.753, 75.894], severity: "Critical" },
    { id: 2, type: "vet", title: "Indore Vet Hospital", desc: "Capacity: 12 rescue berths active", coords: [22.725, 75.865], status: "Open 24/7" },
    { id: 3, type: "forest", title: "Neem Plantation, Indore Bypass", desc: "Planted: 1,200 native saplings", coords: [22.705, 75.912], count: "1,200 Tagged" },
    { id: 4, type: "rescue", title: "Stray Dog — Road Accident", desc: "Reported: Fracture, AB Road, Bhopal", coords: [23.259, 77.412], severity: "Critical" },
    { id: 5, type: "vet", title: "Bhopal City Animal Clinic", desc: "Capacity: 8 slots, Govindpura", coords: [23.242, 77.430], status: "Open 24/7" },

    // ---- CHHATTISGARH ----
    { id: 6, type: "rescue", title: "Dehydrated Stray Cow", desc: "Reported: Heat exhaustion, Vyapar Vihar, Bilaspur", coords: [22.075, 82.138], severity: "Moderate" },
    { id: 7, type: "vet", title: "Bilaspur Animal Clinic & Rehab", desc: "Capacity: 4 critical care slots", coords: [22.085, 82.145], status: "Open 24/7" },
    { id: 8, type: "forest", title: "Peepal Forest Drive, Bilaspur", desc: "Planted: 4,500 native trees", coords: [22.062, 82.115], count: "4,500 Tagged" },
    { id: 9, type: "rescue", title: "Injured Mongoose", desc: "Reported: Vehicle hit, Raipur bypass", coords: [21.250, 81.630], severity: "Moderate" },

    // ---- DELHI / NCR ----
    { id: 10, type: "rescue", title: "Stray Dog Pack — Injury", desc: "Reported: Multiple injuries, Dwarka Sec 10", coords: [28.592, 77.046], severity: "Critical" },
    { id: 11, type: "vet", title: "SPCA Delhi Rescue Centre", desc: "24/7 emergency animal hospital", coords: [28.625, 77.209], status: "Open 24/7" },
    { id: 12, type: "forest", title: "Miyawaki Forest, Mehrauli", desc: "Planted: 3,200 native saplings", coords: [28.523, 77.186], count: "3,200 Tagged" },

    // ---- MAHARASHTRA ----
    { id: 13, type: "rescue", title: "Injured Cattle — Highway", desc: "Reported: Serious leg injury, Pune-Mumbai Expressway", coords: [18.520, 73.855], severity: "Critical" },
    { id: 14, type: "vet", title: "Mumbai Animal Care Trust", desc: "Emergency trauma center, Andheri", coords: [19.119, 72.847], status: "Open 24/7" },
    { id: 15, type: "forest", title: "Urban Forest, Sanjay Gandhi Park", desc: "Planted: 8,500 trees, restoration zone", coords: [19.212, 72.907], count: "8,500 Tagged" },
    { id: 16, type: "rescue", title: "Abandoned Puppies", desc: "Reported: 7 pups abandoned, Nagpur Ring Road", coords: [21.145, 79.088], severity: "Moderate" },

    // ---- KARNATAKA ----
    { id: 17, type: "vet", title: "CUPA Bangalore Shelter", desc: "Capacity: 200 animals, Kengeri", coords: [12.897, 77.498], status: "Open 24/7" },
    { id: 18, type: "rescue", title: "Injured Leopard Cub", desc: "Reported: Disoriented near Bannerghatta", coords: [12.801, 77.575], severity: "Critical" },
    { id: 19, type: "forest", title: "Miyawaki Drive, Electronic City", desc: "Planted: 2,100 saplings, Tech corridor", coords: [12.840, 77.676], count: "2,100 Tagged" },

    // ---- TAMIL NADU ----
    { id: 20, type: "rescue", title: "Stray Dogs — Distemper Outbreak", desc: "Reported: 5 dogs sick, Velachery, Chennai", coords: [12.978, 80.220], severity: "Moderate" },
    { id: 21, type: "vet", title: "Blue Cross Chennai", desc: "India's oldest animal welfare society", coords: [13.053, 80.249], status: "Open 24/7" },

    // ---- WEST BENGAL ----
    { id: 22, type: "rescue", title: "Injured Stork — Wetlands", desc: "Reported: Fishing net entangled, East Kolkata", coords: [22.572, 88.432], severity: "Moderate" },
    { id: 23, type: "forest", title: "Mangrove Restoration, Sundarbans", desc: "Planted: 12,000 mangrove saplings", coords: [21.949, 88.893], count: "12,000 Tagged" },

    // ---- RAJASTHAN ----
    { id: 24, type: "rescue", title: "Desert Fox — Injured", desc: "Reported: Snare trap victim, Jaisalmer outskirts", coords: [26.921, 70.915], severity: "Critical" },
    { id: 25, type: "vet", title: "Jaipur Animal Aid Hospital", desc: "Capacity: 15 emergency beds", coords: [26.912, 75.787], status: "Open 24/7" },

    // ---- TELANGANA ----
    { id: 26, type: "rescue", title: "Stray Dog — Acid Attack Survivor", desc: "Reported: Critical burns, HITEC City Hyderabad", coords: [17.445, 78.381], severity: "Critical" },
    { id: 27, type: "forest", title: "Urban Green Belt, ORR Hyderabad", desc: "Planted: 5,600 avenue trees", coords: [17.366, 78.476], count: "5,600 Tagged" },

    // ---- KERALA ----
    { id: 28, type: "vet", title: "Kochi Pet & Wildlife Rescue", desc: "Specialised in marine & coastal animals", coords: [9.931, 76.267], status: "Open 24/7" },
    { id: 29, type: "forest", title: "Silent Valley Restoration Belt", desc: "Planted: 6,000 endemic forest trees", coords: [11.072, 76.459], count: "6,000 Tagged" },

    // ---- ASSAM ----
    { id: 30, type: "rescue", title: "Injured Rhino Calf", desc: "Reported: Separated from herd, Kaziranga buffer", coords: [26.578, 93.167], severity: "Critical" },
  ];

  if (mapElement) {
    // Initialise Leaflet Map
    mapInstance = L.map("leaflet-map", {
      center: [22.0, 80.0],
      zoom: 5,
      scrollWheelZoom: false
    });

    // Light Voyager CartoDB Tiles
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      maxZoom: 20,
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap'
    }).addTo(mapInstance);

    markersLayer.addTo(mapInstance);

    // Render Markers based on filters
    const renderMapMarkers = () => {
      markersLayer.clearLayers();

      const showRescue = document.getElementById("filter-rescue").checked;
      const showVet = document.getElementById("filter-vet").checked;
      const showForest = document.getElementById("filter-forest").checked;

      mapLocations.forEach(loc => {
        if (loc.type === "rescue" && !showRescue) return;
        if (loc.type === "vet" && !showVet) return;
        if (loc.type === "forest" && !showForest) return;

        // Custom HTML Marker Icon
        const iconClass = `custom-map-marker marker-${loc.type}`;
        const markerIcon = L.divIcon({
          className: "custom-marker-wrapper",
          html: `<div class="${iconClass}"></div>`,
          iconSize: [20, 20]
        });

        // Setup Popup HTML
        let popupHtml = `
          <div class="map-popup-card">
            <h4>
              <i data-lucide="${loc.type === 'rescue' ? 'alert-triangle' : loc.type === 'vet' ? 'stethoscope' : 'sprout'}"></i>
              ${loc.title}
            </h4>
            <p>${loc.desc}</p>
        `;

        if (loc.type === "rescue") {
          popupHtml += `<span class="map-popup-badge text-critical">${loc.severity} Alert</span>`;
        } else if (loc.type === "vet") {
          popupHtml += `<span class="map-popup-badge text-emerald">${loc.status}</span>`;
        } else {
          popupHtml += `<span class="map-popup-badge text-amber">${loc.count}</span>`;
        }
        popupHtml += `</div>`;

        const marker = L.marker(loc.coords, { icon: markerIcon }).bindPopup(popupHtml);
        markersLayer.addLayer(marker);

        // Update SVG Icons in popups on open
        marker.on("popupopen", () => {
          lucide.createIcons();
        });
      });
    };

    // Filters Listeners
    document.getElementById("filter-rescue").addEventListener("change", renderMapMarkers);
    document.getElementById("filter-vet").addEventListener("change", renderMapMarkers);
    document.getElementById("filter-forest").addEventListener("change", renderMapMarkers);

    // Initial Marker Load
    renderMapMarkers();

    // Map Activity Feed Generator
    const feedList = document.getElementById("map-feed-list");
    const updateActivityFeed = () => {
      feedList.innerHTML = "";
      mapLocations.forEach(loc => {
        const feedCard = document.createElement("div");
        feedCard.className = `feed-card feed-${loc.type}`;
        
        let typeIcon = "alert-circle";
        if (loc.type === "vet") typeIcon = "stethoscope";
        if (loc.type === "forest") typeIcon = "sprout";

        feedCard.innerHTML = `
          <div class="feed-title">
            <span>${loc.title}</span>
            <span class="feed-time">Active</span>
          </div>
          <p class="feed-desc">${loc.desc}</p>
        `;

        feedCard.addEventListener("click", () => {
          mapInstance.setView(loc.coords, 14, { animate: true });
          
          // Find and trigger popup for the marker
          markersLayer.eachLayer(marker => {
            if (marker.getLatLng().lat === loc.coords[0] && marker.getLatLng().lng === loc.coords[1]) {
              marker.openPopup();
            }
          });
        });

        feedList.appendChild(feedCard);
      });
      lucide.createIcons();
    };
    updateActivityFeed();
  }

  /* ----------------------------------------------------
     7. Live Rescue Dispatch Tracker Modal Simulation
     ---------------------------------------------------- */
  const trackDispatchBtn = document.getElementById("track-dispatch-btn");
  const trackerModal = document.getElementById("tracker-modal");
  const closeTrackerModal = document.getElementById("close-tracker-modal");
  const movingTruck = document.getElementById("moving-truck");
  const truckPath = document.getElementById("truck-path");
  const driverStatusText = document.getElementById("driver-status-text");
  const driverSubtext = document.getElementById("driver-subtext");
  
  let dispatchAnimTimer;
  let dispatchProgress = 0;

  const runDispatchAnimation = () => {
    dispatchProgress = 0;
    movingTruck.style.left = "30px";
    movingTruck.style.top = "120px";
    driverStatusText.textContent = "Rajesh is starting dispatch...";
    driverSubtext.textContent = "Vehicle has accepted the rescue call. Navigating coordinates.";
    
    // Total steps for path simulation (0% to 100%)
    const pathTotalLength = 310; 
    truckPath.style.strokeDashoffset = pathTotalLength;

    if (dispatchAnimTimer) clearInterval(dispatchAnimTimer);

    dispatchAnimTimer = setInterval(() => {
      dispatchProgress += 2;
      
      // Calculate CSS stroke dash offsets
      const offset = pathTotalLength - (pathTotalLength * (dispatchProgress / 100));
      truckPath.style.strokeDashoffset = offset;

      // Simulated coordinates mapping for the truck dot along the curve
      // Start: 30,120. Control 1: 120,40. Control 2: 180,110. End: 270,30.
      let pct = dispatchProgress / 100;
      
      // Bezier curve calculations for truck movement path representation
      // A cubic bezier interpolation matching Q and T curves
      let x = (1-pct)**3 * 30 + 3*(1-pct)**2 * pct * 120 + 3*(1-pct) * pct**2 * 180 + pct**3 * 270;
      let y = (1-pct)**3 * 120 + 3*(1-pct)**2 * pct * 40 + 3*(1-pct) * pct**2 * 110 + pct**3 * 30;

      movingTruck.style.left = `${x}px`;
      movingTruck.style.top = `${y}px`;

      // Status updates
      if (dispatchProgress < 30) {
        driverStatusText.textContent = "En Route (Transit)";
        driverSubtext.textContent = "Rajesh is driving toward Sector 62. Navigating traffic.";
      } else if (dispatchProgress < 70) {
        driverStatusText.textContent = "Approaching Spot (1.2 km away)";
        driverSubtext.textContent = "Emergency sirens active. Local forest guards alerted to secure perimeter.";
      } else if (dispatchProgress < 99) {
        driverStatusText.textContent = "Arriving at Location...";
        driverSubtext.textContent = "Parking rescue vehicle near Pillar 124. Preparing veterinary kit.";
      } else {
        driverStatusText.textContent = "Arrived & Rescued!";
        driverStatusText.className = "status-highlight text-emerald";
        driverSubtext.textContent = "Stray dog secured. Administering first aid before hospital transit.";
        clearInterval(dispatchAnimTimer);
        playSuccessSound();
      }
    }, 200);
  };

  if (trackDispatchBtn) {
    trackDispatchBtn.addEventListener("click", () => {
      trackerModal.classList.add("open");
      document.body.style.overflow = "hidden";
      setTimeout(runDispatchAnimation, 500);
    });
  }

  const closeTracker = () => {
    trackerModal.classList.remove("open");
    document.body.style.overflow = "";
    clearInterval(dispatchAnimTimer);
  };

  if (closeTrackerModal) closeTrackerModal.addEventListener("click", closeTracker);
  trackerModal.addEventListener("click", (e) => {
    if (e.target === trackerModal) closeTracker();
  });

  /* ----------------------------------------------------
     8. Donation Modal & Preset Selectors
     ---------------------------------------------------- */
  const donationModal = document.getElementById("donation-modal");
  const closeDonationModal = document.getElementById("close-donation-modal");
  const supportBtns = document.querySelectorAll(".support-cause-btn");
  const donationCauseTitle = document.getElementById("donation-cause-title");
  
  const presetBtns = document.querySelectorAll(".preset-btn");
  const customAmountContainer = document.getElementById("custom-amount-container");
  const customAmountVal = document.getElementById("custom-amount-val");
  const panContainer = document.getElementById("pan-number-container");
  const taxExemptCheckbox = document.getElementById("tax-receipt-required");
  const donationForm = document.getElementById("donation-form");

  // Selected preset logic
  presetBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      presetBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      const val = btn.getAttribute("data-val");
      if (val === "custom") {
        customAmountContainer.classList.remove("hidden");
        customAmountVal.setAttribute("required", "true");
      } else {
        customAmountContainer.classList.add("hidden");
        customAmountVal.removeAttribute("required");
        customAmountVal.value = val;
      }
    });
  });

  // Toggle PAN input based on tax checkbox
  if (taxExemptCheckbox) {
    taxExemptCheckbox.addEventListener("change", () => {
      if (taxExemptCheckbox.checked) {
        panContainer.classList.remove("hidden");
        document.getElementById("pan-val").setAttribute("required", "true");
      } else {
        panContainer.classList.add("hidden");
        document.getElementById("pan-val").removeAttribute("required");
      }
    });
  }

  // Open Donation Modal
  supportBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const cause = btn.getAttribute("data-cause");
      donationCauseTitle.innerHTML = `<i data-lucide="heart" class="text-critical"></i> Support ${cause}`;
      donationModal.classList.add("open");
      document.body.style.overflow = "hidden";
      lucide.createIcons();
    });
  });

  const closeDonation = () => {
    donationModal.classList.remove("open");
    document.body.style.overflow = "";
    donationForm.reset();
    // Reset preset buttons to default
    presetBtns.forEach(b => b.classList.remove("active"));
    presetBtns[1].classList.add("active"); // default is ₹500
    customAmountContainer.classList.add("hidden");
    panContainer.classList.remove("hidden");
    taxExemptCheckbox.checked = true;
  };

  if (closeDonationModal) closeDonationModal.addEventListener("click", closeDonation);
  donationModal.addEventListener("click", (e) => {
    if (e.target === donationModal) closeDonation();
  });

  /* ----------------------------------------------------
     9. Interactive Emergency SOS Tab Form controls
     ---------------------------------------------------- */
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => b.classList.remove("active"));
      tabContents.forEach(c => c.classList.remove("active"));

      btn.classList.add("active");
      const tabId = btn.getAttribute("data-tab");
      document.getElementById(tabId).classList.add("active");
    });
  });

  // GPS geolocation simulator
  const geolocateBtn = document.getElementById("geolocate-btn");
  const gpsStatus = document.getElementById("gps-status");
  const rescueLocationInput = document.getElementById("rescue-location");

  if (geolocateBtn) {
    geolocateBtn.addEventListener("click", () => {
      gpsStatus.className = "location-status";
      gpsStatus.textContent = "Acquiring satellites...";

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude.toFixed(6);
            const lng = position.coords.longitude.toFixed(6);
            rescueLocationInput.value = `Latitude: ${lat}, Longitude: ${lng}`;
            gpsStatus.className = "location-status success";
            gpsStatus.textContent = `📍 Coordinates locked successfully.`;
            playSuccessSound();

            // Pan Leaflet map to reporter location
            if (mapInstance) {
              mapInstance.setView([lat, lng], 14, { animate: true });
            }
          },
          (error) => {
            // Mock Location Fallback if coordinates denied or failed
            setTimeout(() => {
              const mockLat = (22.7196 + Math.random() * 0.1).toFixed(6);
              const mockLng = (75.8577 + Math.random() * 0.1).toFixed(6);
              rescueLocationInput.value = `Latitude: ${mockLat}, Longitude: ${mockLng} (Mock Location)`;
              gpsStatus.className = "location-status success";
              gpsStatus.textContent = `📍 Location simulation active (Permission denied).`;
              
              if (mapInstance) {
                mapInstance.setView([mockLat, mockLng], 14, { animate: true });
              }
            }, 1000);
          },
          { timeout: 1500 }
        );
      } else {
        gpsStatus.className = "location-status error";
        gpsStatus.textContent = "Geolocation not supported by this browser.";
      }
    });
  }

  // Drag & Drop Photo Upload Dropzone
  const photoDropzone = document.getElementById("photo-dropzone");
  const fileInput = document.getElementById("rescue-photo");
  const defaultText = document.getElementById("dropzone-default-text");
  const previewContainer = document.getElementById("dropzone-preview-container");
  const previewImg = document.getElementById("preview-img");
  const previewName = document.getElementById("preview-name");
  const previewSize = document.getElementById("preview-size");
  const removeFileBtn = document.getElementById("remove-file-btn");

  if (photoDropzone) {
    photoDropzone.addEventListener("click", (e) => {
      if (e.target !== removeFileBtn && !removeFileBtn.contains(e.target)) {
        fileInput.click();
      }
    });

    photoDropzone.addEventListener("dragover", (e) => {
      e.preventDefault();
      photoDropzone.classList.add("dragover");
    });

    photoDropzone.addEventListener("dragleave", () => {
      photoDropzone.classList.remove("dragover");
    });

    photoDropzone.addEventListener("drop", (e) => {
      e.preventDefault();
      photoDropzone.classList.remove("dragover");
      
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        fileInput.files = files;
        handleFileSelect(files[0]);
      }
    });

    fileInput.addEventListener("change", (e) => {
      if (e.target.files.length > 0) {
        handleFileSelect(e.target.files[0]);
      }
    });

    const handleFileSelect = (file) => {
      if (!file.type.startsWith("image/")) {
        alert("Please upload a valid image file.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        previewImg.src = e.target.result;
        previewName.textContent = file.name;
        previewSize.textContent = `${(file.size / 1024).toFixed(1)} KB`;
        
        defaultText.classList.add("hidden");
        previewContainer.classList.remove("hidden");
      };
      reader.readAsDataURL(file);
    };

    removeFileBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      fileInput.value = "";
      previewImg.src = "";
      previewContainer.classList.add("hidden");
      defaultText.classList.remove("hidden");
    });
  }

  /* ----------------------------------------------------
     10. Form Submission Handlers (Success Modals)
     ---------------------------------------------------- */
  const successModal = document.getElementById("success-modal");
  const closeSuccessModal = document.getElementById("close-success-modal");
  const successOkBtn = document.getElementById("success-ok-btn");
  const successModalTitle = document.getElementById("success-modal-title");
  const successModalDesc = document.getElementById("success-modal-desc");
  const successModalDetails = document.getElementById("success-modal-details");

  const openSuccessModal = (title, desc, detailsHtml) => {
    successModalTitle.textContent = title;
    successModalDesc.textContent = desc;
    successModalDetails.innerHTML = detailsHtml;
    successModal.classList.add("open");
    document.body.style.overflow = "hidden";
    playSuccessSound();
  };

  const closeSuccess = () => {
    successModal.classList.remove("open");
    document.body.style.overflow = "";
  };

  [closeSuccessModal, successOkBtn].forEach(btn => {
    if (btn) btn.addEventListener("click", closeSuccess);
  });
  successModal.addEventListener("click", (e) => {
    if (e.target === successModal) closeSuccess();
  });

  // Emergency SOS Form Submit
  const emergencyForm = document.getElementById("emergency-rescue-form");
  if (emergencyForm) {
    emergencyForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const animal = document.getElementById("animal-type").value;
      const severity = document.getElementById("injury-level").value;
      const location = document.getElementById("rescue-location").value;
      const reporter = document.getElementById("reporter-name").value;
      const phone = document.getElementById("reporter-phone").value;
      
      const ticketId = `PC-REQ-${Math.floor(1000 + Math.random() * 9000)}`;
      const detailsHtml = `
        <div><strong>Ticket ID:</strong> ${ticketId}</div>
        <div><strong>Animal:</strong> Stray ${animal}</div>
        <div><strong>Severity:</strong> <span class="text-critical">${severity}</span></div>
        <div><strong>Location:</strong> ${location}</div>
        <div><strong>Reporter Name:</strong> ${reporter}</div>
        <div><strong>Rescuer Dispatch Status:</strong> Dispatch Queueing (ETA 10-15m)</div>
      `;

      openSuccessModal(
        "Emergency SOS Dispatched!",
        "Our veterinary ambulance coordinators have been alerted. A ticket has been raised inside our emergency dispatch system.",
        detailsHtml
      );

      // Inject dynamically as new rescue item in Leaflet map & feed to make it feel alive!
      const mockLat = (22.7196 + Math.random() * 0.15);
      const mockLng = (75.8577 + Math.random() * 0.15);
      const newLoc = {
        id: mapLocations.length + 1,
        type: "rescue",
        title: `Injured Stray ${animal}`,
        desc: `Reported: ${severity} case, at ${location}`,
        coords: [mockLat, mockLng],
        severity: severity
      };

      mapLocations.unshift(newLoc); // add at start
      if (mapInstance) {
        renderMapMarkers();
        updateActivityFeed();
        // Shift map view to new rescue position
        mapInstance.setView([mockLat, mockLng], 13, { animate: true });
      }

      // Reset Form
      emergencyForm.reset();
      if (fileInput) {
        fileInput.value = "";
        previewImg.src = "";
        previewContainer.classList.add("hidden");
        defaultText.classList.remove("hidden");
      }
      gpsStatus.textContent = "";
    });
  }

  // Volunteer Form Submit
  const volunteerForm = document.getElementById("volunteer-form");
  if (volunteerForm) {
    volunteerForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("volunteer-name").value;
      const email = document.getElementById("volunteer-email").value;
      const interestCheckboxes = document.querySelectorAll('input[name="interest"]:checked');
      
      const interests = [];
      interestCheckboxes.forEach(cb => interests.push(cb.value));

      const regId = `PC-VOL-${Math.floor(5000 + Math.random() * 5000)}`;
      const detailsHtml = `
        <div><strong>Registration ID:</strong> ${regId}</div>
        <div><strong>Name:</strong> ${name}</div>
        <div><strong>Email:</strong> ${email}</div>
        <div><strong>Allocated Squad:</strong> ${interests.join(", ") || "General Support"}</div>
        <div><strong>Status:</strong> Verification Pending (1-2 Days)</div>
      `;

      openSuccessModal(
        "Volunteer Registration Received!",
        "Thank you for joining our network. We are reviewing your application and will send orientation links to your email.",
        detailsHtml
      );

      volunteerForm.reset();
    });
  }

  // Donation Form Submit
  if (donationForm) {
    donationForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const amount = customAmountContainer.classList.contains("hidden") 
        ? document.querySelector(".preset-btn.active").getAttribute("data-val")
        : customAmountVal.value;
      
      const donor = document.getElementById("donor-name").value;
      const email = document.getElementById("donor-email").value;
      const taxReceipt = taxExemptCheckbox.checked;
      const pan = document.getElementById("pan-val").value;

      const transId = `PC-TXN-${Math.floor(100000 + Math.random() * 900000)}`;
      let detailsHtml = `
        <div><strong>Transaction ID:</strong> ${transId}</div>
        <div><strong>Donor Name:</strong> ${donor}</div>
        <div><strong>Email:</strong> ${email}</div>
        <div><strong>Donation Amount:</strong> ₹${amount}</div>
      `;

      if (taxReceipt && pan) {
        detailsHtml += `
          <div><strong>80G Benefit Status:</strong> Eligible (PAN: ${pan.toUpperCase()})</div>
          <div><strong>Certificate:</strong> Sent to email post clearance (24 hours)</div>
        `;
      } else {
        detailsHtml += `<div><strong>Tax Receipt:</strong> Not Requested</div>`;
      }

      closeDonation();

      openSuccessModal(
        "Donation Processed Successfully!",
        "Thank you so much for your financial support. Together we can purchase medical kits, ambulance fuels, and plant trees.",
        detailsHtml
      );
    });
  }

  // Newsletter Form Submit
  const newsletterForm = document.getElementById("newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector("input");
      
      openSuccessModal(
        "Subscription Confirmed!",
        `We have added ${emailInput.value} to our monthly news bulletin. Rest assured, we do not spam.`,
        `<div><strong>Squad:</strong> Eco-Restoration Newsletter</div><div><strong>Cycle:</strong> Monthly updates & event invites</div>`
      );
      
      newsletterForm.reset();
    });
  }
});
