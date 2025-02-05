// ==UserScript==
// @name         Pepper.nl Ultimate Clean Grid
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Complete layout with code span removal
// @author       You
// @match        https://nl.pepper.com/nieuw*
// @match        https://nl.pepper.com/picked*
// @match        https://nl.pepper.com/heetste*
// @match        https://nl.pepper.com/heet*
// @match        https://nl.pepper.com/aanbiedingen*
// @match        https://nl.pepper.com/valentijnsdag*
// @grant        GM_addStyle
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        /* Main grid container */
        .listLayout-main.js-threadList {
            display: grid !important;
            grid-template-columns: repeat(4, minmax(250px, 1fr)) !important;
            gap: 16px !important;
            padding: 16px !important;
        }

        /* Card container */
        .thread-clickRoot {
            display: flex !important;
            flex-direction: column !important;
            height: 100% !important;
            background: transparent !important;
            border-radius: 8px !important;
            overflow: hidden !important;
        }

        /* Article styling */
        .thread.cept-thread-item {
            display: flex !important;
            flex-direction: column !important;
            flex-grow: 1 !important;
            background: white !important;
            border-radius: 8px !important;
            overflow: hidden !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
        }

        /* Header section */
        .threadListCard-header {
            order: 1 !important;
            padding: 12px 12px 0 12px !important;
            font-size: 14px !important;
            font-weight: bold !important;
            color: #333 !important;
            line-height: 1.3 !important;
        }

        /* Image container */
        .threadListCard-image {
            order: 2 !important;
            width: calc(100% - 24px) !important;
            height: 200px !important;
            min-height: 200px !important;
            margin: 0 12px !important;
            flex-shrink: 0 !important;
        }

        /* Image styling */
        .threadListCard-image img {
            width: 100% !important;
            height: 100% !important;
            object-fit: contain !important;
            border-radius: 4px !important;
            transition: none !important;
        }

        /* Body text */
        .threadListCard-body {
            order: 3 !important;
            padding: 8px 12px 12px 12px !important;
            flex-grow: 1 !important;
        }

        .overflow--wrap-break.width--all-12.size--all-s.space--t-2.color--text-TranslucentSecondary.hide--toW3 {
            display: block !important;
            font-size: 12px !important;
            color: #666 !important;
            line-height: 1.4 !important;
            white-space: normal !important;
            overflow: visible !important;
            max-height: none !important;
            padding: 0 !important;
            margin: 0 !important;
        }

        /* Footer section */
        .threadListCard-footer {
            order: 4 !important;
            padding: 12px !important;
            border-top: 1px solid #eee !important;
            margin-top: auto !important;
            background: #f8f8f8 !important;
        }

        /* Button styling */
        .threadListCard-mainButton {
            min-width: 5rem !important;
            font-size: 0.6rem !important;
            padding: 6px 8px !important;
            border-radius: 4px !important;
            background: #007bff !important;
            color: white !important;
            border: none !important;
            cursor: pointer !important;
        }

        /* Responsive design */
        @media (max-width: 1200px) {
            .listLayout-main.js-threadList {
                grid-template-columns: repeat(3, minmax(250px, 1fr)) !important;
            }
        }

        @media (max-width: 800px) {
            .listLayout-main.js-threadList {
                grid-template-columns: repeat(2, minmax(250px, 1fr)) !important;
            }
        }

        @media (max-width: 500px) {
            .listLayout-main.js-threadList {
                grid-template-columns: 1fr !important;
            }
        }

        /* Miscellaneous cleanup */
        .threadListCard-label {
            display: none !important;
        }
    `);

    const cleanLayout = () => {
        // Remove specific code spans first
        document.querySelectorAll('span.size--all-s.overflow--ellipsis.buttonWithCode-code.space--h-3.color--text-TranslucentPrimary').forEach(span => {
            span.remove();
        });

        const container = document.querySelector('.listLayout-main.js-threadList');
        if (!container) return;

        // Remove classless divs
        container.querySelectorAll('div:not([class])').forEach(div => {
            div.replaceWith(...div.childNodes);
        });

        // Remove unnecessary container divs
        Array.from(container.children).forEach(child => {
            if (child.tagName === 'DIV' && !child.classList.contains('thread-clickRoot')) {
                child.remove();
            }
        });

        // Ensure card structure integrity
        container.querySelectorAll('.thread-clickRoot').forEach(card => {
            if (!card.querySelector('.thread.cept-thread-item')) {
                const article = document.createElement('article');
                article.className = 'thread cept-thread-item';
                article.append(...card.children);
                card.appendChild(article);
            }
        });
    };

    // MutationObserver with optimized performance
    let timeout;
    const observer = new MutationObserver((mutations) => {
        if (mutations.some(m => m.addedNodes.length > 0)) {
            clearTimeout(timeout);
            timeout = setTimeout(cleanLayout, 300);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial cleanup
    cleanLayout();
    window.addEventListener('load', cleanLayout);
})();