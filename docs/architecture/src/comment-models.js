/**
 * Comment Data Models for Markdown Task Manager 1.2.0
 * 
 * TypeScript-like schemas for comments, threads, reactions, and rich content
 * Designed for flat storage with runtime nesting calculation
 */

// ============================================================================
// CORE INTERFACES
// ============================================================================

/**
 * Represents a rich text content block
 */
class RichContent {
  constructor(data = {}) {
    this.type = data.type || 'doc';
    this.content = data.content || [];
    this.attrs = data.attrs || {};
  }
  
  /**
   * Convert to plain text
   */
  toText() {
    if (!this.content || this.content.length === 0) {
      return '';
    }
    
    return this.content.map(block => {
      if (block.content) {
        return block.content.map(node => node.text || '').join('');
      }
      return '';
    }).join('\n');
  }
  
  /**
   * Convert to HTML
   */
  toHTML() {
    // Simplified HTML conversion
    // In production, use proper Prosemirror HTML serializer
    const text = this.toText();
    return text.split('\n').map(line => line || '<br>').join('\n');
  }
  
  /**
   * Create from plain text
   */
  static fromText(text) {
    return new RichContent({
      type: 'doc',
      content: [{
        type: 'paragraph',
        content: text.split('\n').map(line => ({
          type: 'text',
          text: line
        }))
      }]
    });
  }
}

/**
 * Represents a user reaction to a comment
 */
class Reaction {
  constructor(data = {}) {
    this.id = data.id || this.generateId();
    this.emoji = data.emoji || '';
    this.users = data.users || []; // Array of user IDs who reacted
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
  
  generateId() {
    return `rxn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * Add a user reaction
   */
  addUser(userId) {
    if (!this.users.includes(userId)) {
      this.users.push(userId);
      this.updatedAt = new Date().toISOString();
      return true;
    }
    return false;
  }
  
  /**
   * Remove a user reaction
   */
  removeUser(userId) {
    const index = this.users.indexOf(userId);
    if (index > -1) {
      this.users.splice(index, 1);
      this.updatedAt = new Date().toISOString();
      return true;
    }
    return false;
  }
  
  /**
   * Check if user has reacted
   */
  hasUser(userId) {
    return this.users.includes(userId);
  }
  
  /**
   * Get reaction count
   */
  count() {
    return this.users.length;
  }
}

/**
 * Represents a single comment
 */
class Comment {
  constructor(data = {}) {
    this.id = data.id || this.generateId();
    this.taskId = data.taskId || '';
    this.threadId = data.threadId || '';
    this.parentId = data.parentId || null; // For nested replies
    this.author = data.author || {
      id: '',
      name: '',
      email: ''
    };
    this.content = data.content instanceof RichContent 
      ? data.content 
      : new RichContent(data.content);
    this.reactions = (data.reactions || []).map(r => new Reaction(r));
    this.isEdited = data.isEdited || false;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.deletedAt = data.deletedAt || null;
  }
  
  generateId() {
    return `cmt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * Get plain text content
   */
  getText() {
    return this.content?.toText() || '';
  }
  
  /**
   * Get HTML content
   */
  getHTML() {
    return this.content?.toHTML() || '';
  }
  
  /**
   * Mark as edited
   */
  markEdited() {
    this.isEdited = true;
    this.updatedAt = new Date().toISOString();
  }
  
  /**
   * Soft delete
   */
  delete() {
    this.deletedAt = new Date().toISOString();
  }
  
  /**
   * Check if deleted
   */
  isDeleted() {
    return this.deletedAt !== null;
  }
  
  /**
   * Add a reaction
   */
  addReaction(emoji, userId) {
    let reaction = this.reactions.find(r => r.emoji === emoji);
    
    if (!reaction) {
      reaction = new Reaction({ emoji });
      this.reactions.push(reaction);
    }
    
    const added = reaction.addUser(userId);
    if (added) {
      this.updatedAt = new Date().toISOString();
    }
    
    return reaction;
  }
  
  /**
   * Remove a reaction
   */
  removeReaction(emoji, userId) {
    const reaction = this.reactions.find(r => r.emoji === emoji);
    if (reaction) {
      const removed = reaction.removeUser(userId);
      if (removed) {
        this.updatedAt = new Date().toISOString();
        
        // Remove reaction if no users
        if (reaction.count() === 0) {
          this.reactions = this.reactions.filter(r => r.emoji !== emoji);
        }
      }
    }
  }
  
  /**
   * Create a reply to this comment
   */
  createReply(data) {
    return new Comment({
      ...data,
      taskId: this.taskId,
      threadId: this.threadId,
      parentId: this.id
    });
  }
  
  /**
   * Serialize for storage
   */
  toJSON() {
    return {
      id: this.id,
      taskId: this.taskId,
      threadId: this.threadId,
      parentId: this.parentId,
      author: this.author,
      content: {
        type: this.content.type,
        content: this.content.content,
        attrs: this.content.attrs
      },
      reactions: this.reactions.map(r => ({
        id: r.id,
        emoji: r.emoji,
        users: r.users,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt
      })),
      isEdited: this.isEdited,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt
    };
  }
  
  /**
   * Create from stored data
   */
  static fromJSON(data) {
    return new Comment({
      id: data.id,
      taskId: data.taskId,
      threadId: data.threadId,
      parentId: data.parentId,
      author: data.author,
      content: new RichContent(data.content),
      reactions: data.reactions,
      isEdited: data.isEdited,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt
    });
  }
}

/**
 * Represents a thread of comments on a task
 */
class CommentThread {
  constructor(data = {}) {
    this.id = data.id || this.generateId();
    this.taskId = data.taskId || '';
    this.title = data.title || '';
    this.comments = (data.comments || []).map(c => new Comment(c));
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.closedAt = data.closedAt || null;
    this.pinned = data.pinned || false;
  }
  
  generateId() {
    return `thr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * Add a comment to the thread
   */
  addComment(data) {
    const comment = data instanceof Comment 
      ? data 
      : new Comment({ ...data, threadId: this.id, taskId: this.taskId });
    
    this.comments.push(comment);
    this.updatedAt = new Date().toISOString();
    
    return comment;
  }
  
  /**
   * Get top-level comments (not replies)
   */
  getTopLevelComments() {
    return this.comments.filter(c => !c.parentId && !c.isDeleted());
  }
  
  /**
   * Get replies to a specific comment
   */
  getReplies(commentId) {
    return this.comments.filter(c => c.parentId === commentId && !c.isDeleted());
  }
  
  /**
   * Build nested comment tree
   */
  getNestedComments() {
    const topLevel = this.getTopLevelComments();
    
    const buildTree = (comment) => {
      const replies = this.getReplies(comment.id);
      return {
        ...comment.toJSON(),
        replies: replies.map(buildTree)
      };
    };
    
    return topLevel.map(buildTree);
  }
  
  /**
   * Close the thread
   */
  close() {
    this.closedAt = new Date().toISOString();
    this.updatedAt = this.closedAt;
  }
  
  /**
   * Reopen the thread
   */
  reopen() {
    this.closedAt = null;
    this.updatedAt = new Date().toISOString();
  }
  
  /**
   * Pin the thread
   */
  pin() {
    this.pinned = true;
    this.updatedAt = new Date().toISOString();
  }
  
  /**
   * Unpin the thread
   */
  unpin() {
    this.pinned = false;
    this.updatedAt = new Date().toISOString();
  }
  
  /**
   * Get comment count (excluding deleted)
   */
  getCommentCount() {
    return this.comments.filter(c => !c.isDeleted()).length;
  }
  
  /**
   * Get reply count
   */
  getReplyCount() {
    return this.comments.filter(c => c.parentId && !c.isDeleted()).length;
  }
  
  /**
   * Serialize for storage
   */
  toJSON() {
    return {
      id: this.id,
      taskId: this.taskId,
      title: this.title,
      comments: this.comments.map(c => c.toJSON()),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      closedAt: this.closedAt,
      pinned: this.pinned
    };
  }
  
  /**
   * Create from stored data
   */
  static fromJSON(data) {
    return new CommentThread({
      id: data.id,
      taskId: data.taskId,
      title: data.title,
      comments: data.comments,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      closedAt: data.closedAt,
      pinned: data.pinned
    });
  }
}

// ============================================================================
// STORAGE SCHEMAS
// ============================================================================

/**
 * Schema for storing comments in kanban.md
 */
const CommentStorageSchema = {
  version: '1.2.0',
  
  // Comment storage structure
  structure: {
    // Top-level comments storage
    comments: {},  // commentId -> Comment JSON
    
    // Thread storage
    threads: {},   // threadId -> Thread JSON
    
    // Indexes for fast lookup
    indexes: {
      byTask: {},      // taskId -> [commentIds]
      byThread: {},    // threadId -> [commentIds]
      byAuthor: {},    // authorId -> [commentIds]
      byDate: []       // [{ commentId, date }]
    }
  },
  
  /**
   * Validate comment data
   */
  validateComment(data) {
    const errors = [];
    
    if (!data.id) errors.push('Missing comment ID');
    if (!data.taskId) errors.push('Missing task ID');
    if (!data.author) errors.push('Missing author');
    if (!data.content) errors.push('Missing content');
    
    return {
      valid: errors.length === 0,
      errors: errors
    };
  },
  
  /**
   * Validate thread data
   */
  validateThread(data) {
    const errors = [];
    
    if (!data.id) errors.push('Missing thread ID');
    if (!data.taskId) errors.push('Missing task ID');
    
    return {
      valid: errors.length === 0,
      errors: errors
    };
  }
};

/**
 * Migration schema for upgrading from previous versions
 */
const MigrationSchema = {
  versions: ['1.1.0', '1.1.1', '1.1.2', '1.2.0'],
  
  /**
   * Migrate from 1.1.x to 1.2.0
   */
  migrateFrom1_1(data) {
    // Transform old note format to new RichContent format
    if (data.notes && typeof data.notes === 'string') {
      data.notes = RichContent.fromText(data.notes).toJSON();
    }
    
    return data;
  },
  
  /**
   * Get migration function for specific version
   */
  getMigration(fromVersion) {
    const versionMap = {
      '1.1.0': this.migrateFrom1_1,
      '1.1.1': this.migrateFrom1_1,
      '1.1.2': this.migrateFrom1_1
    };
    
    return versionMap[fromVersion] || null;
  }
};

// ============================================================================
// EXPORTS
// ============================================================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    RichContent,
    Reaction,
    Comment,
    CommentThread,
    CommentStorageSchema,
    MigrationSchema
  };
}
