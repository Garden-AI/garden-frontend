import React from 'react';
import { Info, Zap } from 'lucide-react';
import { Badge } from '@/components/shadcn/badge';

interface TaskDescriptionProps {
  taskName: string;
  functionName?: string;
}

// Task descriptions based on MatBench Discovery paper (https://arxiv.org/abs/2308.14920)
const TASK_DESCRIPTIONS: Record<string, {
  name: string;
  description: string;
  note?: string;
  type: 'discovery' | 'optimization' | 'prediction';
}> = {
  // Common MatBench Discovery task variants
  'is2re_small': {
    name: 'IS2RE (Small)',
    description: 'Initial Structure to Relaxed Energy - predicts the final energy of a crystal structure after geometric relaxation. This is a quick evaluation using the first 25 structures from the benchmark dataset.',
    note: 'Fast test run for development',
    type: 'prediction',
  },
  'is2re': {
    name: 'IS2RE',
    description: 'Initial Structure to Relaxed Energy - predicts the final energy of a crystal structure after geometric relaxation. Critical for determining material stability.',
    type: 'prediction',
  },
  's2ef': {
    name: 'S2EF',
    description: 'Structure to Energy and Forces - predicts both the energy and atomic forces for a given crystal structure. Essential for molecular dynamics simulations.',
    type: 'prediction',
  },
  'is2rs': {
    name: 'IS2RS',
    description: 'Initial Structure to Relaxed Structure - predicts the final relaxed geometry of a crystal structure. Used to find the most stable atomic arrangements.',
    type: 'optimization',
  },
  'discovery': {
    name: 'Materials Discovery',
    description: 'Evaluates how effectively the model can identify stable materials from a large candidate pool. Measures both accuracy (F1 score) and discovery acceleration factor (DAF).',
    type: 'discovery',
  },
  'stability_prediction': {
    name: 'Stability Prediction',
    description: 'Binary classification task to determine whether a given crystal structure will be thermodynamically stable. Core capability for materials screening.',
    type: 'discovery',
  },
};

// Fallback for unknown tasks
const getTaskInfo = (taskName: string, functionName?: string) => {
  // Try exact match first
  if (TASK_DESCRIPTIONS[taskName]) {
    return TASK_DESCRIPTIONS[taskName];
  }
  
  // Try partial matches
  const lowerTaskName = taskName.toLowerCase();
  for (const [key, info] of Object.entries(TASK_DESCRIPTIONS)) {
    if (lowerTaskName.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerTaskName)) {
      return info;
    }
  }
  
  // Check function name for clues
  const lowerFunctionName = functionName?.toLowerCase() || '';
  if (lowerFunctionName.includes('is2re') && lowerFunctionName.includes('small')) {
    return TASK_DESCRIPTIONS['is2re_small'];
  } else if (lowerFunctionName.includes('is2re')) {
    return TASK_DESCRIPTIONS['is2re'];
  } else if (lowerFunctionName.includes('s2ef')) {
    return TASK_DESCRIPTIONS['s2ef'];
  } else if (lowerFunctionName.includes('is2rs')) {
    return TASK_DESCRIPTIONS['is2rs'];
  } else if (lowerFunctionName.includes('discovery')) {
    return TASK_DESCRIPTIONS['discovery'];
  } else if (lowerFunctionName.includes('stability')) {
    return TASK_DESCRIPTIONS['stability_prediction'];
  }
  
  // Generic fallback
  return {
    name: taskName,
    description: 'This task evaluates model performance on materials science prediction problems.',
    type: 'prediction' as const,
  };
};

const getTypeConfig = (type: string) => {
  switch (type) {
    case 'discovery':
      return {
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: '🔍',
      };
    case 'optimization':
      return {
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: '⚡',
      };
    case 'prediction':
      return {
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: '🎯',
      };
    default:
      return {
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: '📊',
      };
  }
};

export const TaskDescription: React.FC<TaskDescriptionProps> = ({
  taskName,
  functionName,
}) => {
  const taskInfo = getTaskInfo(taskName, functionName);
  const typeConfig = getTypeConfig(taskInfo.type);

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <Info className="h-5 w-5 text-blue-600" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-medium text-blue-900">
              {taskInfo.name}
            </h4>
            <Badge variant="outline" className={typeConfig.color}>
              <span className="mr-1">{typeConfig.icon}</span>
              {taskInfo.type}
            </Badge>
            {taskInfo.note && (
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                <Zap className="h-3 w-3 mr-1" />
                {taskInfo.note}
              </Badge>
            )}
          </div>
          <p className="text-sm text-blue-800 leading-relaxed">
            {taskInfo.description}
          </p>
        </div>
      </div>
    </div>
  );
};