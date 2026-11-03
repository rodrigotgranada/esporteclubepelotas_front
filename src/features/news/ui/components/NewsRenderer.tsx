'use client';

import React from 'react';
import { LayoutContainer, Title, Text, SafeImage } from '@/shared/ui/components';

interface TiptapMark {
  type: string;
  attrs?: Record<string, any>;
}

interface TiptapNode {
  type: string;
  attrs?: Record<string, any>;
  content?: TiptapNode[];
  text?: string;
  marks?: TiptapMark[];
}

interface NewsRendererProps {
  content?: Record<string, any>;
  className?: string;
}

export const NewsRenderer: React.FC<NewsRendererProps> = ({ content, className = '' }) => {
  if (!content || !content.content || !Array.isArray(content.content)) {
    return null;
  }

  const renderMarks = (textNode: TiptapNode, key: number) => {
    let textElement: React.ReactNode = textNode.text || '';

    if (textNode.marks && Array.isArray(textNode.marks)) {
      textNode.marks.forEach((mark, markIdx) => {
        if (mark.type === 'bold') {
          textElement = (
            <strong key={`b-${key}-${markIdx}`} className="font-bold text-text-primary">
              {textElement}
            </strong>
          );
        } else if (mark.type === 'italic') {
          textElement = (
            <em key={`i-${key}-${markIdx}`} className="italic">
              {textElement}
            </em>
          );
        } else if (mark.type === 'strike') {
          textElement = (
            <s key={`s-${key}-${markIdx}`} className="line-through">
              {textElement}
            </s>
          );
        }
      });
    }

    return <React.Fragment key={key}>{textElement}</React.Fragment>;
  };

  const renderInlineContent = (children?: TiptapNode[]) => {
    if (!children) return null;
    return children.map((child, idx) => {
      if (child.type === 'text') {
        return renderMarks(child, idx);
      }
      return null;
    });
  };

  const renderNode = (node: TiptapNode, index: number): React.ReactNode => {
    switch (node.type) {
      case 'heading': {
        const level = node.attrs?.level || 1;
        if (level === 1) {
          return (
            <Title
              key={index}
              level="h2"
              className="text-2xl sm:text-3xl font-extrabold text-text-primary mt-6 mb-3 tracking-tight"
            >
              {renderInlineContent(node.content)}
            </Title>
          );
        }
        if (level === 2) {
          return (
            <Title
              key={index}
              level="h3"
              className="text-xl sm:text-2xl font-bold text-text-primary mt-5 mb-2.5"
            >
              {renderInlineContent(node.content)}
            </Title>
          );
        }
        return (
          <Title
            key={index}
            level="h4"
            className="text-lg sm:text-xl font-semibold text-text-primary mt-4 mb-2"
          >
            {renderInlineContent(node.content)}
          </Title>
        );
      }

      case 'paragraph': {
        return (
          <Text
            key={index}
            as="p"
            className="text-base sm:text-lg leading-relaxed text-text-primary mb-4"
          >
            {renderInlineContent(node.content)}
          </Text>
        );
      }

      case 'blockquote': {
        return (
          <LayoutContainer
            key={index}
            className="border-l-4 border-primary pl-4 py-1 my-5 italic text-text-secondary bg-surface/50 rounded-r-lg"
          >
            {node.content?.map((child, idx) => renderNode(child, idx))}
          </LayoutContainer>
        );
      }

      case 'bulletList': {
        return (
          <LayoutContainer key={index} as="ul" className="list-disc pl-6 space-y-1.5 my-4 text-text-primary text-base">
            {node.content?.map((item, itemIdx) => (
              <LayoutContainer key={itemIdx} as="li" className="leading-relaxed">
                {item.content?.map((p, pIdx) => renderInlineContent(p.content))}
              </LayoutContainer>
            ))}
          </LayoutContainer>
        );
      }

      case 'orderedList': {
        return (
          <LayoutContainer key={index} as="ol" className="list-decimal pl-6 space-y-1.5 my-4 text-text-primary text-base">
            {node.content?.map((item, itemIdx) => (
              <LayoutContainer key={itemIdx} as="li" className="leading-relaxed">
                {item.content?.map((p, pIdx) => renderInlineContent(p.content))}
              </LayoutContainer>
            ))}
          </LayoutContainer>
        );
      }

      case 'horizontalRule': {
        return <LayoutContainer key={index} className="w-full h-px bg-border my-6" />;
      }

      case 'image': {
        const src = node.attrs?.src;
        const alt = node.attrs?.alt || '';
        const caption = node.attrs?.caption || node.attrs?.title || alt;
        const width = node.attrs?.width || '100%';
        const align = node.attrs?.align || 'center';

        const widthClass =
          width === '25%'
            ? 'max-w-xs'
            : width === '50%'
            ? 'max-w-md'
            : width === '75%'
            ? 'max-w-2xl'
            : 'max-w-4xl';

        const alignClass =
          align === 'left'
            ? 'self-start text-left'
            : align === 'right'
            ? 'self-end text-right'
            : 'self-center text-center';

        if (!src) return null;
        return (
          <LayoutContainer key={index} className={`my-6 flex flex-col ${alignClass} w-full ${widthClass}`}>
            <LayoutContainer className="relative w-full rounded-2xl overflow-hidden bg-drawer/30 border border-border shadow-xs">
              <SafeImage
                src={src}
                alt={alt}
                width={800}
                height={500}
                className="w-full h-auto max-h-[520px] object-contain rounded-2xl mx-auto"
              />
            </LayoutContainer>
            {caption && (
              <Text className="text-xs text-text-secondary italic mt-2 px-1">
                {caption}
              </Text>
            )}
          </LayoutContainer>
        );
      }

      default:
        return null;
    }
  };

  return (
    <LayoutContainer className={`article-content flex flex-col ${className}`}>
      {content.content.map((node: TiptapNode, idx: number) => renderNode(node, idx))}
    </LayoutContainer>
  );
};

