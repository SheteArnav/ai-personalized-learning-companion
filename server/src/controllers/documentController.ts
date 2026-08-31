import { Request, Response } from 'express';
import { db } from '../db/database.js';
import { DocumentService } from '../services/documentService.js';

export const getDocuments = (req: Request, res: Response) => {
  try {
    const documents = db.getDocuments();
    res.json({ documents });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const analyzeTextDocument = (req: Request, res: Response) => {
  try {
    const { filename, rawText, fileSize } = req.body;

    if (!rawText || typeof rawText !== 'string') {
      return res.status(400).json({ error: 'Document text content is required' });
    }

    const name = filename || 'Uploaded_Study_Material.txt';
    const size = Number(fileSize) || rawText.length;

    const analyzed = DocumentService.analyzeDocumentContent(name, size, rawText);

    res.json({
      document: analyzed,
      allDocuments: db.getDocuments(),
      message: `Document "${name}" analyzed. Extracted ${analyzed.conceptsExtracted.length} concepts and identified ${analyzed.prerequisiteGaps.length} prerequisite gaps.`,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const mergeDocumentToRoadmap = (req: Request, res: Response) => {
  try {
    const { docId } = req.params;
    const updatedRoadmap = DocumentService.mergeDocumentConceptsIntoRoadmap(docId);
    res.json({
      roadmap: updatedRoadmap,
      message: 'Extracted concept gaps successfully incorporated into learning roadmap.',
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
