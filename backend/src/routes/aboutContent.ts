import express from 'express';
import { supabase } from '../config/supabase';
import logger from '../utils/logger';

const router = express.Router();

// Get all about content blocks
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('about_content')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      logger.error('Error fetching about content:', error);
      return res.status(500).json({
        success: false,
        message: 'Error fetching about content'
      });
    }

    res.json({
      success: true,
      data: data || []
    });
  } catch (error) {
    logger.error('Error fetching about content:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching about content'
    });
  }
});

// Get single about content block
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('about_content')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: 'Content block not found'
      });
    }

    res.json({
      success: true,
      data
    });
  } catch (error) {
    logger.error('Error fetching about content block:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching content block'
    });
  }
});

// Create new about content block
router.post('/', async (req, res) => {
  try {
    const { type, order, content } = req.body;

    if (!type || !content) {
      return res.status(400).json({
        success: false,
        message: 'Type and content are required'
      });
    }

    const { data, error } = await supabase
      .from('about_content')
      .insert({
        type,
        display_order: order || 0,
        content
      })
      .select()
      .single();

    if (error) {
      logger.error('Error creating about content block:', error);
      return res.status(500).json({
        success: false,
        message: 'Error creating content block'
      });
    }

    res.status(201).json({
      success: true,
      data,
      message: 'Content block created successfully'
    });
  } catch (error) {
    logger.error('Error creating about content block:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating content block'
    });
  }
});

// Update about content block
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { type, order, content } = req.body;

    // Check if content block exists
    const { data: existingBlock, error: checkError } = await supabase
      .from('about_content')
      .select('*')
      .eq('id', id)
      .single();

    if (checkError || !existingBlock) {
      return res.status(404).json({
        success: false,
        message: 'Content block not found'
      });
    }

    const { data, error } = await supabase
      .from('about_content')
      .update({
        type,
        display_order: order,
        content,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      logger.error('Error updating about content block:', error);
      return res.status(500).json({
        success: false,
        message: 'Error updating content block'
      });
    }

    res.json({
      success: true,
      data,
      message: 'Content block updated successfully'
    });
  } catch (error) {
    logger.error('Error updating about content block:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating content block'
    });
  }
});

// Delete about content block
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('about_content')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: 'Content block not found'
      });
    }

    res.json({
      success: true,
      message: 'Content block deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting about content block:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting content block'
    });
  }
});

// Reorder content blocks
router.post('/reorder', async (req, res) => {
  try {
    const { blocks } = req.body; // Array of { id, order }

    if (!Array.isArray(blocks)) {
      return res.status(400).json({
        success: false,
        message: 'Blocks array is required'
      });
    }

    // Update each block's order
    const updatePromises = blocks.map(block =>
      supabase
        .from('about_content')
        .update({ display_order: block.order })
        .eq('id', block.id)
    );

    const results = await Promise.all(updatePromises);

    // Check if any update failed
    const hasError = results.some(result => result.error);
    if (hasError) {
      logger.error('Error reordering about content blocks');
      return res.status(500).json({
        success: false,
        message: 'Error reordering content blocks'
      });
    }

    res.json({
      success: true,
      message: 'Content blocks reordered successfully'
    });
  } catch (error) {
    logger.error('Error reordering about content blocks:', error);
    res.status(500).json({
      success: false,
      message: 'Error reordering content blocks'
    });
  }
});

export default router;
