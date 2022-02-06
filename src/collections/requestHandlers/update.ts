import { Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { PayloadRequest } from '../../express/types';
import formatSuccessResponse from '../../express/responses/formatSuccess';

export type UpdateResult = {
  message: string
  doc: Document
};

export default async function update(req: PayloadRequest, res: Response, next: NextFunction): Promise<Response<UpdateResult> | void> {
  try {
    const draft = req.query.draft === 'true';
    const autosave = req.query.autosave === 'true';

    const doc = await this.operations.collections.update({
      req,
      collection: req.collection,
      id: req.params.id,
      data: req.body,
      depth: req.query.depth,
      draft,
      autosave,
    });

    let message = 'Updated successfully.';

    if (draft) message = 'Draft saved successfully.';
    if (autosave) message = 'Autosaved successfully.';

    return res.status(httpStatus.OK).json({
      ...formatSuccessResponse(message, 'message'),
      doc,
    });
  } catch (error) {
    return next(error);
  }
}
