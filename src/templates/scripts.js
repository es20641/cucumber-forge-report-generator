/* globals window, document */
let pauseScrollActions = false;

const toggleFunctionAccordion = (element) => {
  element.classList.toggle('active');
  const panel = element.nextElementSibling;
  if (panel.style.maxHeight) {
    panel.style.maxHeight = null;
  } else {
    panel.style.maxHeight = `${panel.scrollHeight}px`;
    // Close all the other panels
    Array.from(document.getElementsByClassName('feature-button')).forEach((featureButton) => {
      if (element !== featureButton) {
        featureButton.classList.remove('active');
        featureButton.nextElementSibling.style.maxHeight = null;
      }
    });
  }
};

const toggleScenarioButton = (element) => {
  // Clear all the other buttons
  Array.from(document.getElementsByClassName('scenario-button')).forEach((scenarioButton) => {
    scenarioButton.classList.remove('active');
  });
  element.classList.add('active');
};

const scrollTo = (element) => {
  // Pause the scroll actions while we jump to a new location:
  pauseScrollActions = true;
  setTimeout(() => {
    pauseScrollActions = false;
  }, (1000));
  const target = document.getElementById(element.getAttribute('scroll-to-id'));
  target.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
    inline: 'end',
  });
};

const checkVisible = (elm) => {
  const rect = elm.getBoundingClientRect();
  const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
  return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
};

const getVisibleAnchor = () => {
  let visibleAnchor;
  Array.from(document.getElementsByClassName('anchor active')).some((anchor) => {
    if (checkVisible(anchor)) {
      visibleAnchor = anchor;
      return true;
    }
    return false;
  });
  return visibleAnchor;
};

const updateActiveScenarioWhenScrolling = () => {
  if (pauseScrollActions) return;
  const visibleAnchor = getVisibleAnchor();
  if (visibleAnchor) {
    if (visibleAnchor.getAttribute('scenario-button')) {
      const visibleScenarioButton = document.getElementById(visibleAnchor.getAttribute('scenario-button'));
      if (!visibleScenarioButton.classList.contains('active')) {
        toggleScenarioButton(visibleScenarioButton);
      }
    }
  }
};

const toggleDisplayedFeature = (element) => {
  // Deactivate all features
  Array.from(document.getElementsByClassName('feature-wrapper')).forEach((featureWrapper) => {
    featureWrapper.classList.remove('active');
  });
  // Deactivate all anchors
  Array.from(document.getElementsByClassName('anchor')).forEach((anchor) => {
    anchor.classList.remove('active');
  });
  // Activate selected feature
  const featureWrapper = document.getElementById(element.getAttribute('feature-wrapper-id'));
  featureWrapper.classList.add('active');
  Array.from(featureWrapper.querySelectorAll('.anchor')).forEach((anchor) => {
    anchor.classList.add('active');
  });
};

const initTheme = (element) => {
  var darkThemeSelected = (document.getElementById('themeSwitch') != null && document.getElementById('themeSwitch') === 'dark');
  // Update checkbox
  themeSwitch.checked = darkThemeSelected;
  // Update the data-theme attribute
  //darkThemeSelected ? document.body.setAttribute('data-theme', 'dark') : document.body.removeAttribute('data-theme');
  darkThemeSelected ? document.head.setAttribute('data-theme', 'dark') : document.head.removeAttribute('data-theme');
};

const toggleTheme = (element) => {
  if(themeSwitch.checked) {
    // Dark theme has been selected
    document.body.setAttribute('data-theme', 'dark');
    // document.setItem('themeSwitch', 'dark');
  } else {
    // Dark theme has not been selected
    document.body.removeAttribute('data-theme');
    // document.removeItem('themeSwitch');
  }
}

const init = () => {
  // Add listeners for feature buttons
  Array.from(document.getElementsByClassName('feature-button')).forEach((featureButton) => {
    featureButton.addEventListener('click', function click() {
      toggleFunctionAccordion(this);
      toggleDisplayedFeature(this);
      scrollTo(this);
    });
  });

  // Add listeners for scenario buttons
  Array.from(document.getElementsByClassName('scenario-button')).forEach((scenarioButton) => {
    scenarioButton.addEventListener('click', function click() {
      toggleScenarioButton(this);
      scrollTo(this);
    });
  });

  // Add listeners for theme switch button
  var themeSwitch = document.getElementById('themeSwitch');
  if(themeSwitch) {
    initTheme();
    themeSwitch.addEventListener('change', function change() {
      toggleTheme(this);
    });
  }

  // Make sure the right scenario is active when scrolling
  window.addEventListener('scroll', updateActiveScenarioWhenScrolling, true);

  // Open the first feature.
  const firstFeatureButton = document.getElementsByClassName('feature-button')[0];
  if (firstFeatureButton) {
    toggleFunctionAccordion(firstFeatureButton);
    toggleDisplayedFeature(firstFeatureButton);
  }
};

init();
