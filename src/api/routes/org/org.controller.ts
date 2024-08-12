import catchAsync from '../../../helpers/catchAsync'
import type { Response, Request } from 'express'
import { ErrorBadRequest } from '../../../helpers/errors'
import { getAllOrgParams, orgCreateDto, orgPatchDto } from './org.dto'
import { OrgService } from './org.service'

export const OrgController = {
  Create: catchAsync(
    async (req: Request, res: Response) => {
      const validatedBody = orgCreateDto.safeParse(req.body)
      if (!validatedBody.success) {
        throw new ErrorBadRequest('Invalid input')
      }

      const newOrg = await OrgService.Create(validatedBody.data)
      return res.json({ message: 'Organization created', success: true, data: newOrg })
    }
  ),
  Patch: catchAsync(
    async (req: Request, res: Response) => {
      const validatedBody = orgPatchDto.safeParse(req.body)
      if (!validatedBody.success) {
        throw new ErrorBadRequest('Invalid input')
      }

      const { orgId } = req.params

      const patchedOrg = await OrgService.Patch(validatedBody.data, orgId)
      return res.json({ message: 'Org updated', success: true, data: patchedOrg })
    }
  ),
  GetAll: catchAsync(
    async (req: Request, res: Response) => {
      const validatedQuery = getAllOrgParams.safeParse(req.query)
      if (!validatedQuery.success) {
        throw new ErrorBadRequest('Invalid input')
      }
      const orgs = await OrgService.GetAll(validatedQuery.data)
      return res.json({ message: 'Orgs fetched', success: true, data: orgs })
    }
  ),
  GetOne: catchAsync(
    async (req: Request, res: Response) => {
      const { orgId } = req.params
      const org = await OrgService.GetOne(orgId)
      return res.json({ message: 'Org fetched', success: true, data: org })
    }
  )
}
