export interface CreateCommentData {
  content: string
  articleId: number
  parentId: number | null
}

export interface CommentState {
  success: boolean
  message: string
}

export interface AuthorInfo {
  id: string
  username: string
  image_url: string | null
}

export interface CommentWithAuthor {
  id: number
  content: string
  articleId: number | null
  parentId: number | null
  status: 'APPROVED' | 'PENDING' | 'REJECTED'
  createdAt: Date
  updatedAt: Date
  authorId: string
  deleted: boolean
  author: AuthorInfo
  replies: CommentWithAuthor[]
}

export interface DeleteCommentData {
  id: number
}
