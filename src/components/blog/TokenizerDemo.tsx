'use client';

import React, { useState, useMemo } from 'react';
import { stemmer } from 'porter-stemmer';

type DemoMode = 'character-filtering' | 'tokenization' | 'stemming' | 'stopwords' | 'display';
type TokenizationMethod = 'whitespace' | 'trigram';

interface TokenizerDemoProps {
  mode: DemoMode;
  defaultText?: string;
  displayAsTokens?: boolean;
}

const TokenizerDemo: React.FC<TokenizerDemoProps> = ({ 
  mode,
  defaultText = "running easily generational",
  displayAsTokens = false
}) => {
  const [text, setText] = useState(defaultText);
  const [tokenizationMethod, setTokenizationMethod] = useState<TokenizationMethod>('whitespace');
  const [inputTokens, setInputTokens] = useState<string[]>(() => 
    defaultText.split(/[\s,]+/).map(token => token.trim()).filter(token => token.length > 0)
  );
  const [tokenInput, setTokenInput] = useState(() => 
    defaultText.split(/[\s,]+/).map(token => token.trim()).filter(token => token.length > 0).join(' ')
  );
  const [stopwordTokens, setStopwordTokens] = useState<string[]>(() => 
    mode === 'stopwords' ? defaultText.split(/[\s,]+/).map(token => token.trim()).filter(token => token.length > 0) : []
  );
  const [stopwordInput, setStopwordInput] = useState(() => 
    mode === 'stopwords' ? defaultText : ""
  );

  // Calculate text width for cursor positioning
  const getTextWidth = (text: string) => {
    if (typeof document === 'undefined') return text.length * 8;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return text.length * 8;
    context.font = '16px Arial';
    return context.measureText(text).width;
  };

  const processText = useMemo(() => {
    switch (mode) {
      case 'character-filtering':
        return text
          .toLowerCase()
          .replace(/[^\w\s]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
      
      case 'tokenization':
        if (tokenizationMethod === 'whitespace') {
          // Character filtering pre-step: remove punctuation & lowercase, then tokenize
          const filtered = text
            .toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
          return filtered.split(/\s+/).filter(token => token.length > 0);
        } else { // trigram
          const cleanText = text.replace(/\s+/g, ' ').trim();
          if (cleanText.length < 3) return [cleanText];
          const trigrams = [];
          for (let i = 0; i <= cleanText.length - 3; i++) {
            trigrams.push(cleanText.substring(i, i + 3));
          }
          return trigrams;
        }
      
      case 'stemming':
        // For stemming, use the inputTokens array
        return inputTokens;
      
      case 'stopwords':
        // For stopwords, use the stopwordTokens array
        return stopwordTokens;
      
      case 'display':
        // For display mode, show as text or tokens based on displayAsTokens prop
        if (displayAsTokens) {
          return defaultText.split(/\s+/).filter(token => token.length > 0);
        }
        return defaultText;
      
      default:
        return text;
    }
  }, [text, mode, tokenizationMethod, inputTokens, stopwordTokens, defaultText, displayAsTokens]);

  const stemmedTokens = useMemo(() => {
    if (mode === 'stemming' && Array.isArray(processText)) {
      return processText.map(word => stemmer(word));
    }
    return null;
  }, [processText, mode]);

  const filteredTokens = useMemo(() => {
    if (mode === 'stopwords' && Array.isArray(processText)) {
      const stopwords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'this', 'that', 'over', 'under'];
      return processText.filter(word => !stopwords.includes(word.toLowerCase()));
    }
    return null;
  }, [processText, mode]);

  const getLabel = () => {
    switch (mode) {
      case 'character-filtering':
        return 'remove punctuation & lowercase';
      case 'tokenization':
        return tokenizationMethod === 'whitespace' ? 'split on whitespace' : 'trigram tokenization';
      case 'stemming':
        return 'porter stemming';
      case 'stopwords':
        return 'remove stop words';
      case 'display':
        return 'display only';
    }
  };

  return (
    <div className="tokenizer-demo">
      <style jsx>{`
        .tokenizer-demo {
          font-family: Arial, sans-serif;
          background-color: white;
          text-align: center;
          padding: 10px 0 12px 0;
        }
        
        .controls {
          margin-bottom: 2px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          align-items: center;
        }
        
        .text-input {
          background-color: white;
          border: 3px solid #4A90E2;
          border-radius: 15px;
          padding: 0 10px;
          font-size: 16px;
          font-weight: normal;
          color: #333;
          width: 100%;
          max-width: 500px;
          min-height: 56px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          outline: none;
          font-family: inherit;
          resize: none;
          overflow: hidden;
          text-align: center;
          box-sizing: border-box;
          line-height: 52px;
          padding-top: 0;
          padding-bottom: 0;
          caret-color: transparent;
        }
        
        
        .method-selector {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: center;
        }
        
        .method-button {
          background-color: white;
          border: 2px solid #666;
          border-radius: 8px;
          padding: 6px 12px;
          font-size: 14px;
          color: #666;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .method-button:hover {
          background-color: #f0f0f0;
        }
        
        .method-button.active {
          background-color: #4A90E2;
          border-color: #4A90E2;
          color: white;
        }
        
        .ngram-controls {
          display: flex;
          align-items: center;
          gap: 8px;
          justify-content: center;
        }
        
        .ngram-controls label {
          font-size: 14px;
          color: #666;
        }
        
        .ngram-input {
          background-color: white;
          border: 2px solid #666;
          border-radius: 4px;
          padding: 4px 8px;
          font-size: 14px;
          color: #333;
          width: 60px;
          text-align: center;
        }

        .arrow-container {
          text-align: center;
          margin: 0px auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          background-color: white;
        }
        
        .arrow {
          font-size: 24px;
          color: #666;
          line-height: 1;
          margin: 0;
          padding: 0;
        }
        
        .arrow-label {
          font-size: 12px;
          color: #666;
          font-weight: normal;
        }
        
        .processed-text {
          background-color: white;
          border: 3px solid #4A90E2;
          border-radius: 15px;
          padding: 0 10px;
          font-size: 16px;
          font-weight: normal;
          color: #333;
          width: 100%;
          max-width: 500px;
          min-height: 56px;
          margin: 4px auto 0;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          word-wrap: break-word;
          box-sizing: border-box;
          line-height: 52px;
        }
        
        .tokenized-text {
          width: fit-content;
          margin: 4px auto 2px;
          padding: 8px 0;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
          justify-content: center;
          border: 3px solid transparent;
          box-sizing: border-box;
          max-width: 90%;
        }
        
        .token {
          background-color: white;
          border: 3px solid #28a745;
          border-radius: 8px;
          padding: 8px 10px;
          font-size: 16px;
          color: #333;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          white-space: nowrap;
          flex-shrink: 1;
          min-height: 40px;
          box-sizing: border-box;
        }
        
        
        .token-count {
          margin: 4px 0 0 0;
          font-size: 14px;
          color: #666;
        }
        
        .cursor {
          display: inline-block;
          width: 2px;
          height: 16px;
          background-color: #333;
          margin-left: 1px;
          animation: blink 1s infinite;
        }
        
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        .editable-token {
          background-color: white;
          border: 3px solid #28a745;
          border-radius: 8px;
          padding: 8px 10px;
          font-size: 16px;
          color: #333;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          white-space: nowrap;
          flex-shrink: 1;
          min-height: 40px;
          box-sizing: border-box;
          outline: none;
          min-width: 60px;
          text-align: center;
        }
      `}</style>

      <div className="controls">
        {mode === 'display' ? (
          displayAsTokens ? (
            <div className="tokenized-text">
              {(processText as string[]).map((token, index) => (
                <span key={`${token}-${index}`} className="token">
                  {token}
                </span>
              ))}
            </div>
          ) : (
            <div className="processed-text">
              {defaultText}
            </div>
          )
        ) : (mode === 'stemming' || mode === 'stopwords') ? (
          <div className="tokenized-text" style={{ position: 'relative' }}>
            <input
              type="text"
              value={mode === 'stemming' ? tokenInput : stopwordInput}
              onChange={(e) => {
                const value = e.target.value;
                if (mode === 'stemming') {
                  setTokenInput(value);
                  const tokens = value.split(/\s+/).filter(token => token.length > 0);
                  setInputTokens(tokens.length > 0 ? tokens : ['']);
                } else {
                  setStopwordInput(value);
                  const tokens = value.split(/\s+/).filter(token => token.length > 0);
                  setStopwordTokens(tokens.length > 0 ? tokens : ['']);
                }
              }}
              onSelect={(e) => {
                // Always move cursor to the end
                const target = e.target as HTMLInputElement;
                setTimeout(() => {
                  target.setSelectionRange(target.value.length, target.value.length);
                }, 0);
              }}
              onClick={(e) => {
                // Always move cursor to the end
                const target = e.target as HTMLInputElement;
                target.setSelectionRange(target.value.length, target.value.length);
              }}
              onKeyDown={(e) => {
                // Always ensure cursor is at the end
                const target = e.target as HTMLInputElement;
                if (target.selectionStart !== target.value.length) {
                  target.setSelectionRange(target.value.length, target.value.length);
                }
              }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: 0,
                border: 'none',
                outline: 'none',
                fontSize: '16px',
                cursor: 'text'
              }}
              placeholder=""
            />
            {(mode === 'stemming' ? inputTokens : stopwordTokens).map((token, index) => (
              <span key={`${token}-${index}`} className="token">
                {token || '\u00A0'}
                {index === (mode === 'stemming' ? inputTokens : stopwordTokens).length - 1 && <span className="cursor"></span>}
              </span>
            ))}
          </div>
        ) : (
          <div style={{ position: 'relative', width: '100%', maxWidth: '500px' }}>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="text-input"
              placeholder=""
              rows={1}
              style={{
                height: 'auto',
                minHeight: '56px'
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = Math.max(56, target.scrollHeight) + 'px';
              }}
            />
            <span className="cursor" style={{ 
              position: 'absolute', 
              left: `calc(50% + ${getTextWidth(text) / 2 + 1}px)`,
              top: '50%', 
              transform: 'translateY(-75%)',
              margin: 0
            }}></span>
          </div>
        )}
        
        {mode === 'tokenization' && (
          <div className="method-selector">
            <button
              className={`method-button ${tokenizationMethod === 'whitespace' ? 'active' : ''}`}
              onClick={() => setTokenizationMethod('whitespace')}
            >
              Whitespace
            </button>
            <button
              className={`method-button ${tokenizationMethod === 'trigram' ? 'active' : ''}`}
              onClick={() => setTokenizationMethod('trigram')}
            >
              Trigram
            </button>
          </div>
        )}
      </div>

      {mode !== 'display' && (
        <div className="arrow-container">
          <div className="arrow">↓</div>
          <div className="arrow-label">{getLabel()}</div>
        </div>
      )}
      
      {mode === 'display' ? null : mode === 'tokenization' ? (
        <>
          <div className="tokenized-text">
            {(processText as string[]).map((token, index) => (
              <span key={`${token}-${index}`} className="token">
                {token}
              </span>
            ))}
          </div>
          <div className="token-count">
            {(processText as string[]).length} tokens
          </div>
        </>
      ) : mode === 'stemming' && stemmedTokens ? (
        <>
          <div className="tokenized-text">
            {stemmedTokens.map((token, index) => (
              <span key={`${token}-${index}`} className="token">
                {token}
              </span>
            ))}
          </div>
          <div className="token-count">
            {stemmedTokens.length} tokens
          </div>
        </>
      ) : mode === 'stopwords' && filteredTokens ? (
        <>
          <div className="tokenized-text">
            {filteredTokens.map((token, index) => (
              <span key={`${token}-${index}`} className="token">
                {token}
              </span>
            ))}
          </div>
          <div className="token-count">
            {filteredTokens.length} tokens
          </div>
        </>
      ) : (
        <div className="processed-text">
          {processText as string}
        </div>
      )}
    </div>
  );
};

export default TokenizerDemo;