import { describe, expect, it } from 'vitest';
import type { PoseSequence } from '../core/pose';
import { analysisModules, findAnalysisModule } from './index';

const emptySequence: PoseSequence = {
  captureFps: 240,
  frameWidthPx: 1920,
  frameHeightPx: 1080,
  frames: [],
};

describe('analysis module registry', () => {
  it('has unique module ids', () => {
    const ids = analysisModules.map((module) => module.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('finds the running module by id', () => {
    const module = findAnalysisModule('running-sagittal');
    expect(module?.label).toBe('ランニング（横から）');
  });

  it('returns undefined for an unknown id', () => {
    expect(findAnalysisModule('unknown')).toBeUndefined();
  });

  it('running defaults follow docs/metrics.md', () => {
    const module = findAnalysisModule('running-sagittal');
    expect(module?.defaultSettings).toEqual({
      lowpassCutoffHz: 6,
      maxInterpolatedGapFrames: 3,
      minVisibility: 0.6,
      contactHeightLegRatio: 0.02,
      coneDistanceCm: 200,
    });
  });

  it('running analyze is callable with an empty sequence', () => {
    const module = findAnalysisModule('running-sagittal');
    expect(module?.analyze(emptySequence, module.defaultSettings)).toEqual({});
  });
});
