/* eslint-disable no-use-before-define, object-curly-newline, function-paren-newline */
import { div, span, a, img, ul, li } from '../../scripts/dom-helpers.js';

function animateHeader($hdr) {
  const sections = document.querySelectorAll('.section');
  const firstSection = sections[0]; // Get the first section separately
  let lastInvertState = null;

  const checkHeaderClasses = () => {
    const scrollPosition = window.scrollY;

    // Handle the blur effect based on scroll position
    let blurValue = 0;
    if (scrollPosition > 40) {
      blurValue = Math.min((scrollPosition - 40) / 400 * 20, 20); // Scale blur from 0 to 30
    }
    $hdr.style.backdropFilter = `blur(${blurValue}px)`;

    // Check if the header is within the view of the first section
    const firstSectionTop = firstSection.getBoundingClientRect().top;
    if (firstSectionTop <= 60 && firstSectionTop + firstSection.offsetHeight > 60) {
      $hdr.classList.add('top');
    } else {
      $hdr.classList.remove('top');
    }

    // Check for dark section toggle logic
    let isInDarkSection = false;
    sections.forEach((section) => {
      const sectionTop = section.getBoundingClientRect().top;
      if (sectionTop <= 60 && sectionTop + section.offsetHeight > 60) {
        if (section.classList.contains('dark')) {
          isInDarkSection = true;
        }
      }
    });

    if (isInDarkSection !== lastInvertState) {
      if (!isInDarkSection) {
        $hdr.classList.add('invert');
      } else {
        $hdr.classList.remove('invert');
      }
      lastInvertState = isInDarkSection;
    }
  };

  // Bind the scroll event listener
  window.addEventListener('scroll', checkHeaderClasses);

  // Initialize on load
  checkHeaderClasses();
}

// function createNav($header) {
//   const $nav = ul({ class: 'nav' });
//   const navItems = [];
//
//   // Create the navigation items and add them to the header
//   document.querySelectorAll('div.section').forEach((section) => {
//     const navTitle = section.getAttribute('data-nav-title');
//     if (navTitle) {
//       section.id = navTitle.replace(/\s+/g, '-').toLowerCase();
//       const $li = li(a({ href: `#${section.id}` }, navTitle));
//       $nav.appendChild($li);
//       navItems.push({ section, listItem: $li });
//     }
//   });
//
//   $header.appendChild($nav);
//
//   const offset = 140; // Set the desired offset in pixels
//
//   // Scroll event listener to update active link
//   window.addEventListener('scroll', () => {
//     let activeItem = null;
//
//     // Loop through sections to find the one closest to the top with the offset
//     navItems.forEach(({ section, listItem }, index) => {
//       const rect = section.getBoundingClientRect();
//
//       // Check if the section is within the offset range
//       if (rect.top <= offset && rect.bottom > offset) {
//         activeItem = listItem;
//       } else if (rect.top > offset && activeItem === null && index > 0) {
//         // User scrolled up, so make the previous section active if nothing else is
//         const prevItem = navItems[index - 1].listItem;
//         if (prevItem) {
//           activeItem = prevItem;
//         }
//       }
//     });
//
//     // Remove active class from all items, then set it on the currently active one
//     navItems.forEach(({ listItem }) => listItem.classList.remove('active'));
//     if (activeItem) activeItem.classList.add('active');
//   });
// }

function createNav($header) {
  const $nav = ul({ class: 'nav' });
  const navItems = [];
  const sections = [];

  // Create the navigation items and add them to the header
  document.querySelectorAll('div.section').forEach((section, index) => {
    const navTitle = section.getAttribute('data-nav-title');
    if (navTitle) {
      section.id = navTitle.replace(/\s+/g, '-').toLowerCase();

      // Create the navigation link
      const $li = li(a({ href: `#${section.id}` }, navTitle));
      $nav.appendChild($li);
      navItems.push({ section, listItem: $li });

      // Add click event to update URL hash without jumping
      $li.querySelector('a').addEventListener('click', (event) => {
        event.preventDefault(); // Prevent the default link behavior
        document.getElementById(section.id).scrollIntoView({ behavior: 'smooth' });

        // Update the URL hash
        history.pushState(null, null, `#${section.id}`);
      });

      // Store the section for scrolling
      sections.push(section);

      // Create the "Next Section" button and append it to the section
      const button = a({ class: 'btn-next-section' }, div({ class: 'bar' }), div({ class: 'arrow' }));
      button.addEventListener('click', () => {
        const nextSection = sections[index + 1];
        if (nextSection) {
          nextSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
      section.appendChild(button);
    }
  });

  $header.appendChild($nav);

  const offset = 140; // Set the desired offset in pixels

  // Scroll event listener to update active link
  window.addEventListener('scroll', () => {
    let activeItem = null;

    // Loop through sections to find the one closest to the top with the offset
    navItems.forEach(({ section, listItem }, index) => {
      const rect = section.getBoundingClientRect();

      // Check if the section is within the offset range
      if (rect.top <= offset && rect.bottom > offset) {
        activeItem = listItem;
      } else if (rect.top > offset && activeItem === null && index > 0) {
        // User scrolled up, so make the previous section active if nothing else is
        const prevItem = navItems[index - 1].listItem;
        if (prevItem) {
          activeItem = prevItem;
        }
      }
    });

    // Remove active class from all items, then set it on the currently active one
    navItems.forEach(({ listItem }) => listItem.classList.remove('active'));
    if (activeItem) activeItem.classList.add('active');
  });
}

export default async function decorate(block) {
  const $homeBtn = a({ class: 'home', href: '#' },
    img({ src: '/icons/adobe-logo.svg', width: 27, height: 27, alt: 'Adobe' }),
    span('Adobe Managed Services'),
  );

  const $header = div(
    $homeBtn,
  );

  block.remove();

  const $hdr = document.querySelector('header');
  $hdr.append($header);
  createNav($header);
  animateHeader($hdr);
}
