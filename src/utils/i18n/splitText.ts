/**
 * Custom SplitText implementation for GSAP animations
 * Alternative to GSAP's premium SplitText plugin
 */

export interface SplitTextResult {
  chars: HTMLElement[];
  words: HTMLElement[];
  lines: HTMLElement[];
  revert: () => void;
}

/**
 * Split text into characters, words, and lines
 */
export function splitText(
  element: HTMLElement,
  options: {
    type?: 'chars' | 'words' | 'lines' | 'words,chars' | 'lines,words,chars';
  } = {}
): SplitTextResult {
  const { type = 'chars' } = options;
  const originalHTML = element.innerHTML;
  const text = element.textContent || '';
  
  const chars: HTMLElement[] = [];
  const words: HTMLElement[] = [];
  const lines: HTMLElement[] = [];
  
  // Clear element
  element.innerHTML = '';
  
  // Split by lines first (if needed)
  if (type.includes('lines')) {
    const lineWrapper = document.createElement('div');
    lineWrapper.style.display = 'block';
    
    // Simple line splitting (can be improved with actual line break detection)
    const textLines = text.split('\n').filter(line => line.trim());
    
    textLines.forEach((lineText, lineIndex) => {
      const lineSpan = document.createElement('div');
      lineSpan.style.display = 'block';
      lineSpan.setAttribute('data-line-index', lineIndex.toString());
      
      // Split line into words
      if (type.includes('words')) {
        const wordsInLine = lineText.split(/\s+/).filter(word => word);
        
        wordsInLine.forEach((wordText, wordIndex) => {
          const wordSpan = document.createElement('span');
          wordSpan.style.display = 'inline-block';
          wordSpan.setAttribute('data-word-index', wordIndex.toString());
          wordSpan.style.marginRight = '0.25em';
          
          // Split word into chars
          if (type.includes('chars')) {
            wordText.split('').forEach((char, charIndex) => {
              const charSpan = document.createElement('span');
              charSpan.textContent = char === ' ' ? '\u00A0' : char;
              charSpan.style.display = 'inline-block';
              charSpan.setAttribute('data-char-index', charIndex.toString());
              
              if (char === ' ') {
                charSpan.style.width = '0.3em';
              }
              
              chars.push(charSpan);
              wordSpan.appendChild(charSpan);
            });
          } else {
            wordSpan.textContent = wordText;
          }
          
          words.push(wordSpan);
          lineSpan.appendChild(wordSpan);
        });
      } else {
        // Just split into chars without words
        lineText.split('').forEach((char, charIndex) => {
          const charSpan = document.createElement('span');
          charSpan.textContent = char === ' ' ? '\u00A0' : char;
          charSpan.style.display = 'inline-block';
          charSpan.setAttribute('data-char-index', charIndex.toString());
          
          if (char === ' ') {
            charSpan.style.width = '0.3em';
          }
          
          chars.push(charSpan);
          lineSpan.appendChild(charSpan);
        });
      }
      
      lines.push(lineSpan);
      lineWrapper.appendChild(lineSpan);
    });
    
    element.appendChild(lineWrapper);
  } else if (type.includes('words')) {
    // Split into words only
    const wordsInText = text.split(/\s+/).filter(word => word);
    
    wordsInText.forEach((wordText, wordIndex) => {
      const wordSpan = document.createElement('span');
      wordSpan.style.display = 'inline-block';
      wordSpan.setAttribute('data-word-index', wordIndex.toString());
      wordSpan.style.marginRight = '0.25em';
      
      // Split word into chars
      if (type.includes('chars')) {
        wordText.split('').forEach((char, charIndex) => {
          const charSpan = document.createElement('span');
          charSpan.textContent = char === ' ' ? '\u00A0' : char;
          charSpan.style.display = 'inline-block';
          charSpan.setAttribute('data-char-index', charIndex.toString());
          
          if (char === ' ') {
            charSpan.style.width = '0.3em';
          }
          
          chars.push(charSpan);
          wordSpan.appendChild(charSpan);
        });
      } else {
        wordSpan.textContent = wordText;
      }
      
      words.push(wordSpan);
      element.appendChild(wordSpan);
    });
  } else {
    // Split into chars only (default)
    text.split('').forEach((char, charIndex) => {
      const charSpan = document.createElement('span');
      charSpan.textContent = char === ' ' ? '\u00A0' : char;
      charSpan.style.display = 'inline-block';
      charSpan.setAttribute('data-char-index', charIndex.toString());
      
      if (char === ' ') {
        charSpan.style.width = '0.3em';
      }
      
      chars.push(charSpan);
      element.appendChild(charSpan);
    });
  }
  
  return {
    chars,
    words,
    lines,
    revert: () => {
      element.innerHTML = originalHTML;
    }
  };
}

/**
 * Simple character split (most common use case)
 */
export function splitTextToChars(element: HTMLElement): HTMLElement[] {
  const result = splitText(element, { type: 'chars' });
  return result.chars;
}
