// src/components/journal/DreamDetail.tsx - Updated version with image toggle

import React from 'react';
import { X, Play, Mic, Wand2, Brain, Image, Settings } from 'lucide-react';
import TextToSpeech from '../common/TextToSpeech';
import type { Dream } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface DreamDetailProps {
  dream: Dream | null;
  isGenerating: boolean;
  isAnalyzing: boolean;
  generateImages: boolean;
  onClose: () => void;
  onDelete: (dreamId: string) => void;
  onGenerateStory: () => void;
  onAnalyze: () => void;
  onGenerateImagesChange: (generate: boolean) => void;
}

const DreamDetail: React.FC<DreamDetailProps> = ({
  dream,
  isGenerating,
  isAnalyzing,
  generateImages,
  onClose,
  onDelete,
  onGenerateStory,
  onAnalyze,
  onGenerateImagesChange
}) => {
  const { user, isGuest } = useAuth();
  const [showImageToggle, setShowImageToggle] = React.useState(false);

  if (!dream) return null;

  const handlePlayAudio = () => {
    if (dream.audioBlob) {
      const audioUrl = URL.createObjectURL(dream.audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        overflowY: 'auto'
      }}
      onClick={handleBackdropClick}
    >
      <div 
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          maxWidth: '1024px',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Fixed at top */}
        <div 
          style={{
            padding: '24px',
            borderBottom: '1px solid #E5E7EB',
            backgroundColor: 'white',
            borderRadius: '16px 16px 0 0',
            position: 'sticky',
            top: 0,
            zIndex: 10
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ paddingRight: '40px' }}>
              <h2 style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                color: '#1F2937', 
                marginBottom: '8px',
                margin: '0 0 8px 0'
              }}>
                {dream.title}
              </h2>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '16px', 
                fontSize: '14px', 
                color: '#6B7280' 
              }}>
                <span>{dream.date}</span>
                <span>•</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {dream.inputMode === 'voice' ? (
                    <>
                      <Mic style={{ width: '12px', height: '12px' }} />
                      <span>Voice Memo</span>
                    </>
                  ) : (
                    <span>Text</span>
                  )}
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {dream.audioBlob && (
                <button
                  onClick={handlePlayAudio}
                  style={{
                    backgroundColor: '#DBEAFE',
                    color: '#2563EB',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#BFDBFE'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#DBEAFE'}
                >
                  <Play style={{ width: '12px', height: '12px' }} />
                  <span>Play</span>
                </button>
              )}
              
              {user && !isGuest && dream.userId === user.uid && (
                <button
                  onClick={() => onDelete(dream.id)}
                  style={{
                    color: '#EF4444',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px',
                    borderRadius: '6px',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#DC2626'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#EF4444'}
                  title="Delete dream"
                >
                  <X style={{ width: '20px', height: '20px' }} />
                </button>
              )}
              
              {/* Close button */}
              <button
                onClick={onClose}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  color: '#9CA3AF',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '4px',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#6B7280'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#9CA3AF'}
              >
                <X style={{ width: '24px', height: '24px' }} />
              </button>
            </div>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div 
          style={{
            padding: '24px',
            overflowY: 'auto',
            flex: 1
          }}
        >
          {/* Original Dream */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#1F2937', 
              marginBottom: '12px',
              margin: '0 0 12px 0'
            }}>
              Original Dream
            </h3>
            <div style={{
              backgroundColor: '#F9FAFB',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid #E5E7EB'
            }}>
              <p style={{ 
                color: '#374151', 
                lineHeight: '1.6',
                margin: 0
              }}>
                {dream.originalDream}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          {(!dream.story || !dream.analysis) && (
            <div style={{ 
              marginBottom: '24px'
            }}>
              <div style={{ 
                display: 'flex', 
                gap: '12px',
                flexWrap: 'wrap',
                alignItems: 'center'
              }}>
                {!dream.story && (
                  <>
                    <button
                      onClick={onGenerateStory}
                      disabled={isGenerating}
                      style={{
                        background: 'linear-gradient(135deg, #6b46c1 0%, #7c3aed 100%)',
                        color: 'white',
                        padding: '10px 16px',
                        borderRadius: '12px',
                        fontWeight: '500',
                        border: 'none',
                        cursor: isGenerating ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s',
                        opacity: isGenerating ? 0.6 : 1,
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                      onMouseEnter={(e) => {
                        if (!isGenerating) {
                          e.currentTarget.style.background = 'linear-gradient(135deg, #7c3aed 0%, #6b21a8 100%)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isGenerating) {
                          e.currentTarget.style.background = 'linear-gradient(135deg, #6b46c1 0%, #7c3aed 100%)';
                        }
                      }}
                    >
                      {isGenerating ? (
                        <>
                          <div style={{
                            width: '16px',
                            height: '16px',
                            border: '2px solid white',
                            borderTopColor: 'transparent',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                          }} />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <Wand2 style={{ width: '16px', height: '16px' }} />
                          <span>Generate Fairy Tale</span>
                        </>
                      )}
                    </button>

                    {/* Image Toggle Button */}
                    <button
                      onClick={() => setShowImageToggle(!showImageToggle)}
                      style={{
                        backgroundColor: showImageToggle ? '#E9D5FF' : '#F3F4F6',
                        color: showImageToggle ? '#6B21A8' : '#374151',
                        padding: '10px 12px',
                        borderRadius: '12px',
                        fontWeight: '500',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s'
                      }}
                      title="Story generation settings"
                    >
                      <Settings style={{ width: '16px', height: '16px' }} />
                    </button>
                  </>
                )}
                
                {!dream.analysis && (
                  <button
                    onClick={onAnalyze}
                    disabled={isAnalyzing}
                    style={{
                      background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
                      color: 'white',
                      padding: '10px 16px',
                      borderRadius: '12px',
                      fontWeight: '500',
                      border: 'none',
                      cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.2s',
                      opacity: isAnalyzing ? 0.6 : 1,
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    onMouseEnter={(e) => {
                      if (!isAnalyzing) {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isAnalyzing) {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)';
                      }
                    }}
                  >
                    {isAnalyzing ? (
                      <>
                        <div style={{
                          width: '16px',
                          height: '16px',
                          border: '2px solid white',
                          borderTopColor: 'transparent',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }} />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Brain style={{ width: '16px', height: '16px' }} />
                        <span>Analyze Dream</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Image Generation Toggle */}
              {showImageToggle && !dream.story && (
                <div style={{
                  marginTop: '12px',
                  padding: '12px',
                  backgroundColor: '#F3F1FF',
                  borderRadius: '12px',
                  border: '1px solid #E9D5FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Image style={{ width: '16px', height: '16px', color: '#6B21A8' }} />
                    <span style={{ fontSize: '14px', color: '#374151' }}>
                      Generate illustrations with story
                    </span>
                  </div>
                  <label style={{ 
                    position: 'relative',
                    display: 'inline-flex',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="checkbox"
                      checked={generateImages}
                      onChange={(e) => onGenerateImagesChange(e.target.checked)}
                      style={{ 
                        position: 'absolute',
                        opacity: 0,
                        pointerEvents: 'none'
                      }}
                    />
                    <div style={{
                      width: '44px',
                      height: '24px',
                      backgroundColor: generateImages ? '#6B21A8' : '#E5E7EB',
                      borderRadius: '12px',
                      transition: 'background-color 0.2s',
                      position: 'relative'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: '2px',
                        left: generateImages ? '22px' : '2px',
                        width: '20px',
                        height: '20px',
                        backgroundColor: 'white',
                        borderRadius: '10px',
                        transition: 'left 0.2s',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                      }} />
                    </div>
                  </label>
                </div>
              )}
            </div>
          )}

          {/* Generated Fairy Tale */}
          {dream.story && (
            <div style={{ marginBottom: '24px' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                marginBottom: '12px' 
              }}>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  color: '#1F2937',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Wand2 style={{ width: '20px', height: '20px', color: '#6b46c1' }} />
                  <span>Generated Fairy Tale</span>
                </h3>
                <TextToSpeech text={dream.story} />
              </div>
              <div style={{
                background: 'linear-gradient(135deg, #faf5ff 0%, #fdf2f8 50%, #eef2ff 100%)',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid #a78bfa',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
              }}>
                <p style={{ 
                  color: '#374151', 
                  lineHeight: '1.7',
                  margin: 0,
                  whiteSpace: 'pre-wrap'
                }}>
                  {dream.story}
                </p>
              </div>
            </div>
          )}

          {/* Dream Analysis */}
          {dream.analysis && (
            <div style={{ marginBottom: '24px' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                marginBottom: '12px' 
              }}>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  color: '#1F2937',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Brain style={{ width: '20px', height: '20px', color: '#4f46e5' }} />
                  <span>Dream Analysis</span>
                </h3>
                <TextToSpeech text={dream.analysis} />
              </div>
              <div style={{
                background: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 50%, #faf5ff 100%)',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid #a5b4fc',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
              }}>
                <p style={{ 
                  color: '#374151', 
                  lineHeight: '1.7',
                  margin: 0,
                  whiteSpace: 'pre-wrap'
                }}>
                  {dream.analysis}
                </p>
              </div>
            </div>
          )}

          {/* Images */}
          {dream.images && dream.images.length > 0 && (
            <div>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                color: '#1F2937', 
                marginBottom: '12px',
                margin: '0 0 12px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Image style={{ width: '20px', height: '20px', color: '#6b46c1' }} />
                <span>Story Illustrations</span>
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '16px'
              }}>
                {dream.images.map((image, i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <div style={{
                      aspectRatio: '1',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      backgroundColor: '#F3F4F6',
                      marginBottom: '8px'
                    }}>
                      <img 
                        src={image.url} 
                        alt={image.description}
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover' 
                        }}
                      />
                    </div>
                    <p style={{ 
                      fontSize: '14px', 
                      fontWeight: '500', 
                      color: '#1F2937',
                      margin: '0 0 4px 0'
                    }}>
                      {image.scene}
                    </p>
                    <p style={{ 
                      fontSize: '12px', 
                      color: '#6B7280',
                      margin: 0
                    }}>
                      {image.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DreamDetail;