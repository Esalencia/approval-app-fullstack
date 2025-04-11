'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

interface WorkflowStage {
  id: number;
  name: string;
  description: string;
  completed: boolean;
  active: boolean;
  locked: boolean;
}

interface WorkflowProgressProps {
  applicationId: string | number;
  onStageClick?: (stage: WorkflowStage) => void;
}

const WorkflowProgress: React.FC<WorkflowProgressProps> = ({ applicationId, onStageClick }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStage, setCurrentStage] = useState<number>(1);
  const [progress, setProgress] = useState<number>(0);
  
  // Define all workflow stages
  const [stages, setStages] = useState<WorkflowStage[]>([
    {
      id: 1,
      name: 'Application Form',
      description: 'Submit your building plan application',
      completed: false,
      active: true,
      locked: false
    },
    {
      id: 2,
      name: 'Document Verification',
      description: 'Upload and verify required documents',
      completed: false,
      active: false,
      locked: true
    },
    {
      id: 3,
      name: 'Payment',
      description: 'Pay application and inspection fees',
      completed: false,
      active: false,
      locked: true
    },
    {
      id: 4,
      name: 'Inspection Scheduling',
      description: 'Schedule your building inspection',
      completed: false,
      active: false,
      locked: true
    },
    {
      id: 5,
      name: 'Inspections',
      description: 'Complete required inspections',
      completed: false,
      active: false,
      locked: true
    },
    {
      id: 6,
      name: 'Certificate',
      description: 'Receive certificate of compliance',
      completed: false,
      active: false,
      locked: true
    }
  ]);

  // Fetch workflow progress from API
  useEffect(() => {
    const fetchWorkflowProgress = async () => {
      if (!applicationId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5001/api/workflow/applications/${applicationId}/progress`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch workflow progress');
        }
        
        const data = await response.json();
        
        if (data.success) {
          setCurrentStage(data.progress.currentStage);
          setProgress(data.progress.progress);
          
          // Update stages based on current progress
          setStages(prevStages => 
            prevStages.map(stage => ({
              ...stage,
              completed: stage.id < data.progress.currentStage,
              active: stage.id === data.progress.currentStage,
              locked: stage.id > data.progress.currentStage
            }))
          );
        }
      } catch (err: any) {
        console.error('Error fetching workflow progress:', err);
        setError(err.message || 'Failed to load workflow progress');
      } finally {
        setLoading(false);
      }
    };
    
    fetchWorkflowProgress();
  }, [applicationId]);

  const handleStageClick = (stage: WorkflowStage) => {
    // Don't allow clicking on locked stages
    if (stage.locked) return;
    
    // Call the parent component's handler if provided
    if (onStageClick) {
      onStageClick(stage);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#224057]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-semibold text-[#224057] mb-4">Application Progress</h2>
      
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
        <div 
          className="bg-[#224057] h-2.5 rounded-full" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      {/* Stages */}
      <div className="space-y-4">
        {stages.map((stage) => (
          <div 
            key={stage.id}
            onClick={() => handleStageClick(stage)}
            className={`p-4 rounded-lg border transition-all ${
              stage.active 
                ? 'border-[#224057] bg-blue-50' 
                : stage.completed 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-200 bg-gray-50'
            } ${!stage.locked ? 'cursor-pointer hover:shadow-md' : 'opacity-70 cursor-not-allowed'}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                  stage.completed 
                    ? 'bg-green-500 text-white' 
                    : stage.active 
                      ? 'bg-[#224057] text-white' 
                      : 'bg-gray-300 text-gray-600'
                }`}>
                  {stage.completed ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    stage.id
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{stage.name}</h3>
                  <p className="text-sm text-gray-500">{stage.description}</p>
                </div>
              </div>
              
              {stage.locked && (
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkflowProgress;
