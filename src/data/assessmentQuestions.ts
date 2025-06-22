/**
 * Behavioral Assessment Question Bank
 * Research-based questions for cognitive bias detection and behavioral pattern analysis
 * Based on Financial Health Network 2024 standards and behavioral economics research
 */

import { BiasAssessmentQuestion, CognitiveBiasType } from '../types';

export const ASSESSMENT_QUESTIONS: BiasAssessmentQuestion[] = [
    // Overconfidence Bias Questions
    {
        id: 'overconfidence_1',
        category: 'overconfidence',
        question: 'When making investment decisions, how often do you believe your analysis is more accurate than market experts?',
        type: 'scale',
        options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'],
        weight: 0.8
    },
    {
        id: 'overconfidence_2',
        category: 'overconfidence',
        question: 'You researched a stock for 2 hours and feel confident it will outperform the market. A financial advisor suggests a diversified index fund instead. What do you do?',
        type: 'scenario',
        scenario: 'Investment decision scenario: Individual stock vs. professional advice',
        options: [
            'Follow the advisor\'s recommendation - they have more experience',
            'Invest 50% in the stock and 50% in the index fund',
            'Stick with my stock choice - my research gives me confidence',
            'Ask for more opinions before deciding',
            'Invest in the stock but with a smaller amount'
        ],
        weight: 0.9
    },
    {
        id: 'overconfidence_3',
        category: 'overconfidence',
        question: 'How accurately can you predict your portfolio\'s performance over the next year?',
        type: 'multiple-choice',
        options: [
            'Within 1-2% - I have a good sense of the market',
            'Within 5% - I can make reasonable estimates',
            'Within 10% - I have some idea but lots of uncertainty',
            'Within 20% - There\'s so much I can\'t predict',
            'I can\'t predict it at all - too many unknown factors'
        ],
        weight: 0.7
    },

    // Loss Aversion Bias Questions
    {
        id: 'loss_aversion_1',
        category: 'loss-aversion',
        question: 'Which scenario feels worse to you?',
        type: 'scenario',
        scenario: 'Financial loss comparison',
        options: [
            'Losing $500 from your savings account',
            'Missing out on a $500 gain you could have made',
            'Both feel equally bad',
            'Neither bothers me much',
            'I focus on learning from both situations'
        ],
        weight: 0.9
    },
    {
        id: 'loss_aversion_2',
        category: 'loss-aversion',
        question: 'When one of your investments is down 20%, what is your typical reaction?',
        type: 'multiple-choice',
        options: [
            'Sell immediately to prevent further losses',
            'Hold and hope it recovers to break-even',
            'Research why it\'s down and make an informed decision',
            'Buy more if the fundamentals are still strong',
            'Set a stop-loss and stick to my plan'
        ],
        weight: 0.8
    },

    // Confirmation Bias Questions
    {
        id: 'confirmation_bias_1',
        category: 'confirmation-bias',
        question: 'When researching an investment you\'re excited about, how often do you actively seek out negative opinions?',
        type: 'scale',
        options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'],
        weight: 0.8
    },
    {
        id: 'confirmation_bias_2',
        category: 'confirmation-bias',
        question: 'You believe cryptocurrency is the future of money. You see conflicting headlines: "Bitcoin hits new high" and "Experts warn of crypto bubble". Which do you click first?',
        type: 'scenario',
        scenario: 'Information selection scenario',
        options: [
            'The positive headline - it supports my view',
            'The negative headline - I want to understand the risks',
            'I read both articles with equal interest',
            'I skip both and look for more balanced sources',
            'I don\'t read news about my investments'
        ],
        weight: 0.9
    },

    // Anchoring Bias Questions
    {
        id: 'anchoring_1',
        category: 'anchoring',
        question: 'When setting a price to sell your house, what most influences your asking price?',
        type: 'multiple-choice',
        options: [
            'What I originally paid for it',
            'Recent comparable sales in the neighborhood',
            'The highest price I\'ve seen in the area',
            'What my real estate agent recommends',
            'Current market conditions and demand'
        ],
        weight: 0.8
    },
    {
        id: 'anchoring_2',
        category: 'anchoring',
        question: 'A stock you bought at $100 is now at $80. The analyst price target is $90. How does the $100 purchase price affect your decision?',
        type: 'scenario',
        scenario: 'Investment anchoring scenario',
        options: [
            'I hold until it gets back to $100 - I don\'t want to lose money',
            'The purchase price doesn\'t matter - I focus on future prospects',
            'I\'d sell at $90 to minimize my loss',
            'I\'d buy more to average down to $90',
            'I\'d reassess based on current fundamentals, not past price'
        ],
        weight: 0.9
    },

    // Mental Accounting Questions  
    {
        id: 'mental_accounting_1',
        category: 'mental-accounting',
        question: 'You receive a $1,000 bonus and also have $1,000 in credit card debt. What do you do?',
        type: 'scenario',
        scenario: 'Mental accounting scenario',
        options: [
            'Pay off the credit card debt completely',
            'Put the bonus in savings and pay the credit card minimum',
            'Split it - pay some debt and save some',
            'Spend the bonus on something special and pay debt separately',
            'Invest the bonus for potential higher returns'
        ],
        weight: 0.9
    },

    // Availability Heuristic Questions
    {
        id: 'availability_1',
        category: 'availability-heuristic',
        question: 'After hearing news about a market crash, how much does this influence your investment decisions?',
        type: 'scale',
        options: ['Not at all', 'A little', 'Somewhat', 'Quite a bit', 'Completely'],
        weight: 0.8
    },

    // Herd Mentality Questions
    {
        id: 'herd_mentality_1',
        category: 'herd-mentality',
        question: 'During a market rally when everyone is buying, what are you most likely to do?',
        type: 'multiple-choice',
        options: [
            'Buy more - the trend must continue',
            'Stay the course with my existing plan',
            'Become more cautious - markets seem overheated',
            'Research whether my investments are overvalued',
            'Consider taking some profits'
        ],
        weight: 0.8
    },

    // Recency Bias Questions
    {
        id: 'recency_bias_1',
        category: 'recency-bias',
        question: 'When evaluating your investment strategy, what time period do you focus on most?',
        type: 'multiple-choice',
        options: [
            'The last month or quarter',
            'The last year',
            'The last 3-5 years',
            'The last 10+ years',
            'Multiple time periods for perspective'
        ],
        weight: 0.8
    },

    // Sunk Cost Fallacy Questions
    {
        id: 'sunk_cost_1',
        category: 'sunk-cost-fallacy',
        question: 'You\'ve invested $5,000 in a stock that\'s now worth $2,000. Analysis suggests it will likely decline further. What do you do?',
        type: 'scenario',
        scenario: 'Sunk cost investment scenario',
        options: [
            'Hold it - I\'ve already lost too much to sell now',
            'Sell immediately to preserve remaining value',
            'Research more and make a decision based on future prospects',
            'Set a stop-loss and stick to it',
            'Consider it a learning experience and move on'
        ],
        weight: 0.9
    },

    // Framing Effect Questions
    {
        id: 'framing_effect_1',
        category: 'framing-effect',
        question: 'Two investment options: Option A: "90% chance of not losing money" vs Option B: "10% chance of loss". Which sounds more appealing?',
        type: 'scenario',
        scenario: 'Framing equivalence test',
        options: [
            'Option A sounds much safer',
            'Option A sounds somewhat safer',
            'Both sound exactly the same to me',
            'Option B sounds somewhat better',
            'Option B sounds much better'
        ],
        weight: 0.9
    }
];

// Question scoring weights by bias type
export const BIAS_SCORING_WEIGHTS: Record<CognitiveBiasType, number> = {
    'overconfidence': 1.2,
    'loss-aversion': 1.1,
    'confirmation-bias': 1.0,
    'anchoring': 0.9,
    'availability-heuristic': 0.8,
    'mental-accounting': 0.9,
    'herd-mentality': 0.8,
    'recency-bias': 0.7,
    'sunk-cost-fallacy': 1.0,
    'framing-effect': 0.8
};

// Scoring functions for different question types
export class AssessmentScoring {
    
    static scoreScaleQuestion(response: string, biasType: CognitiveBiasType): number {
        const scaleValues: Record<string, number> = {
            'Never': 0,
            'Rarely': 0.25,
            'Sometimes': 0.5,
            'Often': 0.75,
            'Always': 1.0,
            'Not at all': 0,
            'A little': 0.25,
            'Somewhat': 0.5,
            'Quite a bit': 0.75,
            'Very much': 1.0,
            'Completely': 1.0
        };
        
        return (scaleValues[response] || 0.5) * BIAS_SCORING_WEIGHTS[biasType];
    }
    
    static scoreScenarioQuestion(response: string, questionId: string, biasType: CognitiveBiasType): number {
        // Scenario-specific scoring logic
        const scenarioScores: Record<string, Record<string, number>> = {
            'overconfidence_2': {
                'Follow the advisor\'s recommendation - they have more experience': 0.1,
                'Invest 50% in the stock and 50% in the index fund': 0.3,
                'Stick with my stock choice - my research gives me confidence': 0.9,
                'Ask for more opinions before deciding': 0.2,
                'Invest in the stock but with a smaller amount': 0.4
            },
            'loss_aversion_1': {
                'Losing $500 from your savings account': 0.8,
                'Missing out on a $500 gain you could have made': 0.2,
                'Both feel equally bad': 0.5,
                'Neither bothers me much': 0.1,
                'I focus on learning from both situations': 0.1
            },
            'confirmation_bias_2': {
                'The positive headline - it supports my view': 0.9,
                'The negative headline - I want to understand the risks': 0.1,
                'I read both articles with equal interest': 0.2,
                'I skip both and look for more balanced sources': 0.1,
                'I don\'t read news about my investments': 0.3
            },
            'anchoring_2': {
                'I hold until it gets back to $100 - I don\'t want to lose money': 0.9,
                'The purchase price doesn\'t matter - I focus on future prospects': 0.1,
                'I\'d sell at $90 to minimize my loss': 0.6,
                'I\'d buy more to average down to $90': 0.7,
                'I\'d reassess based on current fundamentals, not past price': 0.1
            },
            'mental_accounting_1': {
                'Pay off the credit card debt completely': 0.1,
                'Put the bonus in savings and pay the credit card minimum': 0.8,
                'Split it - pay some debt and save some': 0.4,
                'Spend the bonus on something special and pay debt separately': 0.9,
                'Invest the bonus for potential higher returns': 0.6
            },
            'sunk_cost_1': {
                'Hold it - I\'ve already lost too much to sell now': 0.9,
                'Sell immediately to preserve remaining value': 0.2,
                'Research more and make a decision based on future prospects': 0.1,
                'Set a stop-loss and stick to it': 0.2,
                'Consider it a learning experience and move on': 0.1
            },
            'framing_effect_1': {
                'Option A sounds much safer': 0.8,
                'Option A sounds somewhat safer': 0.6,
                'Both sound exactly the same to me': 0.1,
                'Option B sounds somewhat better': 0.4,
                'Option B sounds much better': 0.2
            }
        };
        
        const questionScores = scenarioScores[questionId] || {};
        return (questionScores[response] || 0.5) * BIAS_SCORING_WEIGHTS[biasType];
    }
}

// Helper function to get questions by bias type
export function getQuestionsByBias(biasType: CognitiveBiasType): BiasAssessmentQuestion[] {
    return ASSESSMENT_QUESTIONS.filter(q => q.category === biasType);
}

// Helper function to get all bias types covered
export function getAllBiasTypes(): CognitiveBiasType[] {
    return Array.from(new Set(ASSESSMENT_QUESTIONS.map(q => q.category)));
}
