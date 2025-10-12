"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { stemmer } from "porter-stemmer";

type DemoMode =
  | "character-filtering"
  | "tokenization"
  | "stemming"
  | "stopwords"
  | "display";
type TokenizationMethod = "whitespace" | "trigram";

interface TokenizerDemoProps {
  mode: DemoMode;
  defaultText?: string;
  displayAsTokens?: boolean;
}

const TokenizerDemo: React.FC<TokenizerDemoProps> = ({
  mode,
  defaultText = "running easily generational",
  displayAsTokens = false,
}) => {
  const [text, setText] = useState(defaultText);
  const [tokenizationMethod, setTokenizationMethod] =
    useState<TokenizationMethod>("whitespace");
  const [inputTokens, setInputTokens] = useState<string[]>(() =>
    defaultText
      .split(/[\s,]+/)
      .map((token) => token.trim())
      .filter((token) => token.length > 0),
  );
  const [stopwordTokens, setStopwordTokens] = useState<string[]>(() =>
    mode === "stopwords"
      ? defaultText
          .split(/[\s,]+/)
          .map((token) => token.trim())
          .filter((token) => token.length > 0)
      : [],
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  // Set client flag after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Auto-resize textarea on mobile and ensure proper height calculation
  useEffect(() => {
    if (textareaRef.current && isClient) {
      const target = textareaRef.current;
      // Reset height to auto to recalculate
      target.style.height = "auto";
      // Set to scrollHeight or minimum height
      const newHeight = Math.max(50, target.scrollHeight);
      target.style.height = newHeight + "px";
    }
  }, [text, isClient]);

  // Force re-render on window resize to handle mobile rotation
  useEffect(() => {
    const handleResize = () => {
      if (textareaRef.current && isClient) {
        const target = textareaRef.current;
        setTimeout(() => {
          target.style.height = "auto";
          const newHeight = Math.max(50, target.scrollHeight);
          target.style.height = newHeight + "px";
        }, 100);
      }
      if (outputRef.current && isClient) {
        const target = outputRef.current;
        setTimeout(() => {
          target.style.height = "auto";
          const newHeight = Math.max(50, target.scrollHeight);
          target.style.height = newHeight + "px";
        }, 100);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isClient]);

  const processText = useMemo(() => {
    switch (mode) {
      case "character-filtering":
        return text
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/\s+/g, " ")
          .trim();

      case "tokenization":
        if (tokenizationMethod === "whitespace") {
          return text
            .split(/[\s.,;:!?()[\]{}'"-]+/)
            .filter((token) => token.length > 0);
        } else {
          // trigram
          const cleanText = text.replace(/\s+/g, " ").trim();
          if (cleanText.length < 3) return [cleanText];
          const trigrams = [];
          for (let i = 0; i <= cleanText.length - 3; i++) {
            trigrams.push(cleanText.substring(i, i + 3));
          }
          return trigrams;
        }

      case "stemming":
        // For stemming, use the inputTokens array
        return inputTokens;

      case "stopwords":
        // For stopwords, use the stopwordTokens array
        return stopwordTokens;

      case "display":
        // For display mode, show as text or tokens based on displayAsTokens prop
        if (displayAsTokens) {
          return defaultText.split(/\s+/).filter((token) => token.length > 0);
        }
        return defaultText;

      default:
        return text;
    }
  }, [
    text,
    mode,
    tokenizationMethod,
    inputTokens,
    stopwordTokens,
    defaultText,
    displayAsTokens,
  ]);

  const stemmedTokens = useMemo(() => {
    if (mode === "stemming" && Array.isArray(processText)) {
      return processText.map((word) => stemmer(word));
    }
    return null;
  }, [processText, mode]);

  const filteredTokens = useMemo(() => {
    if (mode === "stopwords" && Array.isArray(processText)) {
      const stopwords = [
        "a",
        "an",
        "and",
        "are",
        "as",
        "at",
        "be",
        "but",
        "by",
        "for",
        "if",
        "in",
        "into",
        "is",
        "it",
        "no",
        "not",
        "of",
        "on",
        "or",
        "such",
        "that",
        "the",
        "their",
        "then",
        "there",
        "these",
        "they",
        "this",
        "to",
        "was",
        "will",
        "with",
      ];
      return processText.filter(
        (word) => !stopwords.includes(word.toLowerCase()),
      );
    }
    return null;
  }, [processText, mode]);

  // Auto-resize output box when content changes
  useEffect(() => {
    if (outputRef.current && isClient) {
      const target = outputRef.current;
      // Force recalculation by temporarily setting height to auto
      target.style.height = "auto";
      const newHeight = Math.max(50, target.scrollHeight);
      target.style.height = newHeight + "px";
    }
  }, [processText, isClient, mode]);

  const getLabel = () => {
    switch (mode) {
      case "character-filtering":
        return "lowercase & fold diacritics";
      case "tokenization":
        return tokenizationMethod === "whitespace"
          ? "split on whitespace and punctuation"
          : "trigram tokenization";
      case "stemming":
        return "porter stemming";
      case "stopwords":
        return "remove stop words";
      case "display":
        return "display only";
    }
  };

  return (
    <div
      className="tokenizer-demo"
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "white",
        textAlign: "center",
        padding: "10px 0 12px 0",
      }}
    >
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
          border: 3px solid #4a90e2;
          border-radius: 15px;
          padding: 13px 10px;
          font-size: 16px;
          font-weight: normal;
          color: #333;
          width: 100%;
          max-width: 500px;
          min-height: 50px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          outline: none;
          font-family: inherit;
          resize: none;
          overflow: hidden;
          overflow-wrap: break-word;
          text-align: center;
          box-sizing: border-box;
          line-height: 1.4;
          height: auto;
          caret-color: auto;
          display: flex;
          align-items: center;
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
          background-color: #4a90e2;
          border-color: #4a90e2;
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
          border: 3px solid #4a90e2;
          border-radius: 15px;
          padding: 0 10px;
          font-size: 16px;
          font-weight: normal;
          color: #333;
          width: 100%;
          max-width: 500px;
          min-height: 50px;
          margin: 4px auto 0;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          display: block;
          word-wrap: break-word;
          box-sizing: border-box;
          line-height: 1.2;
          padding: 16px 10px;
          min-height: 56px;
          height: auto;
        }

        @media (max-width: 768px) {
          .text-input {
            min-height: 50px;
          }
          .processed-text {
            min-height: 50px;
            height: auto !important;
          }
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
          min-height: 50px;
          box-sizing: border-box;
        }

        .token-count {
          margin: 4px 0 0 0;
          font-size: 14px;
          color: #666;
        }

        .editable-token {
          background-color: white;
          border: 3px solid #28a745;
          border-radius: 8px;
          padding: 8px 10px;
          margin: 0;
          font-size: 16px;
          color: #333;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          white-space: nowrap;
          flex-shrink: 1;
          min-height: 50px;
          height: 50px;
          box-sizing: border-box;
          outline: none;
          text-align: center;
          font-family: inherit;
          line-height: normal;
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          background-clip: padding-box;
          vertical-align: baseline;
        }
      `}</style>

      <div className="controls">
        {mode === "display" ? (
          displayAsTokens ? (
            <div
              className="tokenized-text"
              style={{
                width: "fit-content",
                margin: "4px auto 2px",
                padding: "8px 0",
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                alignItems: "center",
                justifyContent: "center",
                maxWidth: "90%",
              }}
            >
              {(processText as string[]).map((token, index) => (
                <span key={`${token}-${index}`} className="token">
                  {token}
                </span>
              ))}
            </div>
          ) : (
            <div
              ref={outputRef}
              className="processed-text"
              style={{
                backgroundColor: "white",
                border: "3px solid #4a90e2",
                borderRadius: "15px",
                padding: "16px 10px",
                fontSize: "16px",
                color: "#333",
                width: "100%",
                maxWidth: "500px",
                minHeight: "50px",
                margin: "4px auto 0",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                display: "block",
                textAlign: "center",
                boxSizing: "border-box",
                lineHeight: "1.2",
              }}
            >
              {defaultText}
            </div>
          )
        ) : mode === "stemming" || mode === "stopwords" ? (
          <div
            className="tokenized-text"
            style={{
              width: "fit-content",
              margin: "4px auto 2px",
              padding: "8px 0",
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              alignItems: "center",
              justifyContent: "center",
              maxWidth: "90%",
            }}
          >
            {(mode === "stemming" ? inputTokens : stopwordTokens).map(
              (token, index) => (
                <input
                  key={`token-${index}`}
                  className="editable-token"
                  value={token || ""}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    const tokens =
                      mode === "stemming"
                        ? [...inputTokens]
                        : [...stopwordTokens];
                    tokens[index] = newValue;

                    // If box becomes empty and there are other boxes, remove it and focus left
                    if (newValue === "" && tokens.length > 1) {
                      const parent = e.currentTarget.parentElement;
                      const filtered = tokens.filter((_, i) => i !== index);

                      if (mode === "stemming") {
                        setInputTokens(filtered);
                      } else {
                        setStopwordTokens(filtered);
                      }

                      setTimeout(() => {
                        const leftIndex = Math.max(0, index - 1);
                        if (parent && parent.children[leftIndex]) {
                          const leftInput = parent.children[
                            leftIndex
                          ] as HTMLInputElement;
                          leftInput.focus();
                        }
                      }, 0);
                    } else {
                      if (mode === "stemming") {
                        setInputTokens(tokens);
                      } else {
                        setStopwordTokens(tokens);
                      }
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === " ") {
                      e.preventDefault();
                      const parent = e.currentTarget.parentElement;
                      const tokens =
                        mode === "stemming"
                          ? [...inputTokens]
                          : [...stopwordTokens];
                      tokens.splice(index + 1, 0, "");

                      if (mode === "stemming") {
                        setInputTokens(tokens);
                      } else {
                        setStopwordTokens(tokens);
                      }

                      setTimeout(() => {
                        if (parent && parent.children[index + 1]) {
                          const nextInput = parent.children[
                            index + 1
                          ] as HTMLInputElement;
                          nextInput.focus();
                        }
                      }, 0);
                    }
                  }}
                  onBlur={() => {
                    const tokens =
                      mode === "stemming" ? inputTokens : stopwordTokens;
                    if (token === "" && tokens.length > 1) {
                      const filtered = tokens.filter((_, i) => i !== index);
                      if (mode === "stemming") {
                        setInputTokens(filtered);
                      } else {
                        setStopwordTokens(filtered);
                      }
                    }
                  }}
                  onInput={(e) => {
                    const target = e.target as HTMLInputElement;
                    if (isClient) {
                      const canvas = document.createElement("canvas");
                      const context = canvas.getContext("2d");
                      if (context) {
                        context.font = "16px Arial";
                        const textWidth = context.measureText(
                          target.value || "a",
                        ).width;
                        target.style.width =
                          Math.max(40, textWidth + 26) + "px";
                      }
                    }
                  }}
                  style={{
                    width: isClient
                      ? (() => {
                          const canvas = document.createElement("canvas");
                          const context = canvas.getContext("2d");
                          if (context) {
                            context.font = "16px Arial";
                            const textWidth = context.measureText(
                              token || "a",
                            ).width;
                            return Math.max(40, textWidth + 26) + "px";
                          }
                          return (
                            Math.max(40, (token?.length || 1) * 9 + 26) + "px"
                          );
                        })()
                      : Math.max(40, (token?.length || 1) * 9 + 26) + "px",
                    backgroundColor: "white",
                    border: "3px solid #28a745",
                    borderRadius: "8px",
                    padding: "8px 10px",
                    fontSize: "16px",
                    color: "#333",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    whiteSpace: "nowrap",
                    minHeight: "50px",
                    height: "50px",
                    boxSizing: "border-box",
                    outline: "none",
                    textAlign: "center",
                    fontFamily: "inherit",
                  }}
                />
              ),
            )}
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="text-input"
            placeholder=""
            rows={1}
            style={{
              height: "auto",
              minHeight: "50px",
              backgroundColor: "white",
              border: "3px solid #4a90e2",
              borderRadius: "15px",
              padding: "13px 10px",
              fontSize: "16px",
              color: "#333",
              width: "100%",
              maxWidth: "500px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
              outline: "none",
              fontFamily: "inherit",
              resize: "none",
              overflow: "hidden",
              textAlign: "center",
              boxSizing: "border-box",
              lineHeight: "1.4",
              caretColor: "auto",
              display: "flex",
              alignItems: "center",
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              const minHeight = 50;
              target.style.height = minHeight + "px";
              target.style.height =
                Math.max(minHeight, target.scrollHeight) + "px";
            }}
          />
        )}

        {mode === "tokenization" && (
          <div
            className="method-selector"
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <button
              className={`method-button ${tokenizationMethod === "whitespace" ? "active" : ""}`}
              onClick={() => setTokenizationMethod("whitespace")}
              style={{
                backgroundColor:
                  tokenizationMethod === "whitespace" ? "#4a90e2" : "white",
                border: `2px solid ${tokenizationMethod === "whitespace" ? "#4a90e2" : "#666"}`,
                borderRadius: "8px",
                padding: "6px 12px",
                fontSize: "14px",
                color: tokenizationMethod === "whitespace" ? "white" : "#666",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              Whitespace
            </button>
            <button
              className={`method-button ${tokenizationMethod === "trigram" ? "active" : ""}`}
              onClick={() => setTokenizationMethod("trigram")}
              style={{
                backgroundColor:
                  tokenizationMethod === "trigram" ? "#4a90e2" : "white",
                border: `2px solid ${tokenizationMethod === "trigram" ? "#4a90e2" : "#666"}`,
                borderRadius: "8px",
                padding: "6px 12px",
                fontSize: "14px",
                color: tokenizationMethod === "trigram" ? "white" : "#666",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              Trigram
            </button>
          </div>
        )}
      </div>

      {mode !== "display" && (
        <div
          className="arrow-container"
          style={{
            textAlign: "center",
            margin: "0px auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2px",
            backgroundColor: "white",
          }}
        >
          <div
            className="arrow"
            style={{
              fontSize: "24px",
              color: "#666",
              lineHeight: "1",
              margin: "0",
              padding: "0",
            }}
          >
            ↓
          </div>
          <div
            className="arrow-label"
            style={{
              fontSize: "12px",
              color: "#666",
              fontWeight: "normal",
            }}
          >
            {getLabel()}
          </div>
        </div>
      )}

      {mode === "display" ? null : mode === "tokenization" ? (
        <>
          <div
            className="tokenized-text"
            style={{
              width: "fit-content",
              margin: "4px auto 2px",
              padding: "8px 0",
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              alignItems: "center",
              justifyContent: "center",
              maxWidth: "90%",
            }}
          >
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
      ) : mode === "stemming" && stemmedTokens ? (
        <>
          <div
            className="tokenized-text"
            style={{
              width: "fit-content",
              margin: "4px auto 2px",
              padding: "8px 0",
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              alignItems: "center",
              justifyContent: "center",
              maxWidth: "90%",
            }}
          >
            {stemmedTokens.map((token, index) => (
              <span key={`${token}-${index}`} className="token">
                {token}
              </span>
            ))}
          </div>
          <div className="token-count">{stemmedTokens.length} tokens</div>
        </>
      ) : mode === "stopwords" && filteredTokens ? (
        <>
          <div
            className="tokenized-text"
            style={{
              width: "fit-content",
              margin: "4px auto 2px",
              padding: "8px 0",
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              alignItems: "center",
              justifyContent: "center",
              maxWidth: "90%",
            }}
          >
            {filteredTokens.map((token, index) => (
              <span key={`${token}-${index}`} className="token">
                {token}
              </span>
            ))}
          </div>
          <div className="token-count">{filteredTokens.length} tokens</div>
        </>
      ) : (
        <div
          ref={outputRef}
          className="processed-text"
          style={{
            backgroundColor: "white",
            border: "3px solid #4a90e2",
            borderRadius: "15px",
            padding: "16px 10px",
            fontSize: "16px",
            color: "#333",
            width: "100%",
            maxWidth: "500px",
            minHeight: "50px",
            margin: "4px auto 0",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            display: "block",
            textAlign: "center",
            boxSizing: "border-box",
            lineHeight: "1.2",
          }}
        >
          {processText as string}
        </div>
      )}
    </div>
  );
};

export default TokenizerDemo;
