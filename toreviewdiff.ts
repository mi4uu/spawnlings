

 act as a reviewer of this code, check code quality, errors, problems with design, typings security or runtime errors ,
  give me list that contain filename and line where you see problem or it is worth to comment,
	short summary of problem,
	long comment that you make about it explaining the problem in details , and if possible suggested solution to fix it




diff --git a/acrocharge/apps/services/dynamic-document/src/app/__tests__/fixtures/dynamicDocumentDto.fixture.ts b/acrocharge/apps/services/dynamic-document/src/app/__tests__/fixtures/dynamicDocumentDto.fixture.ts
new file mode 100644
index 0000000000..847e32cd17
--- /dev/null
+++ b/acrocharge/apps/services/dynamic-document/src/app/__tests__/fixtures/dynamicDocumentDto.fixture.ts
@@ -0,0 +1,19 @@
+import { DynamicDocumentDto } from '@ac/dynamic-document/types';
+import { MerchantOfferingEnum } from '@ac/merchant/offering/types';
+
+export const dynamicDocumentDtoFixture: DynamicDocumentDto = {
+	dynamicDocumentUuid: '2abaf6bc-cfd7-4807-828e-449e6d1a60e5',
+	conditions: [
+		{
+			argumentIds: ['132'],
+			conditions: {
+				'merchant-offering': [MerchantOfferingEnum.Subscription],
+			},
+			name: 'test',
+		},
+	],
+	isActive: true,
+	isDraft: false,
+	reasonGroupId: '61c49e6280c2812d68bf1d4c',
+	updatedBy: 'google-oauth2|117786089207069694966',
+};
diff --git a/acrocharge/apps/services/dynamic-document/src/app/__tests__/fixtures/reasonGroupId.fixture.ts b/acrocharge/apps/services/dynamic-document/src/app/__tests__/fixtures/reasonGroupId.fixture.ts
new file mode 100644
index 0000000000..0072c122dc
--- /dev/null
+++ b/acrocharge/apps/services/dynamic-document/src/app/__tests__/fixtures/reasonGroupId.fixture.ts
@@ -0,0 +1 @@
+export const reasonGroupIdFixture = '61c49e6280c2812d68bf1d4b';
diff --git a/acrocharge/apps/services/dynamic-document/src/app/__tests__/mocks/DynamicDocumentDalMockService.ts b/acrocharge/apps/services/dynamic-document/src/app/__tests__/mocks/DynamicDocumentDalMockService.ts
new file mode 100644
index 0000000000..2dfe0c1953
--- /dev/null
+++ b/acrocharge/apps/services/dynamic-document/src/app/__tests__/mocks/DynamicDocumentDalMockService.ts
@@ -0,0 +1,3 @@
+export class DynamicDocumentDalMockService {
+	async getActiveDynamicDocumentsByReasonGroupId(reasonGroupId: string) {}
+}
diff --git a/acrocharge/apps/services/dynamic-document/src/app/dynamic-document.controller.spec.ts b/acrocharge/apps/services/dynamic-document/src/app/dynamic-document.controller.spec.ts
index f93b9a0529..7d96dd8a49 100644
--- a/acrocharge/apps/services/dynamic-document/src/app/dynamic-document.controller.spec.ts
+++ b/acrocharge/apps/services/dynamic-document/src/app/dynamic-document.controller.spec.ts
@@ -1,22 +1,39 @@
 import { Test, TestingModule } from '@nestjs/testing';

 import { DynamicDocumentController } from './dynamic-document.controller';
 import { DynamicDocumentService } from './dynamic-document.service';
+import { rootMongooseTestModule } from '@ac/nest-mongo-connection';
+import { MongooseModule } from '@nestjs/mongoose';
+import {
+	DYNAMIC_DOCUMENT_SCHEMA_NAME,
+	DynamicDocumentDalModule,
+	DynamicDocumentSchema,
+} from '@ac/dynamic-document/database';

 describe('DynamicDocumentController', () => {
 	let app: TestingModule;

 	beforeAll(async () => {
 		app = await Test.createTestingModule({
 			controllers: [DynamicDocumentController],
 			providers: [DynamicDocumentService],
+			imports: [
+				rootMongooseTestModule(),
+				MongooseModule.forFeature([
+					{
+						name: DYNAMIC_DOCUMENT_SCHEMA_NAME,
+						schema: DynamicDocumentSchema,
+					},
+				]),
+				DynamicDocumentDalModule,
+			],
 		}).compile();
 	});

 	describe('getData', () => {
 		it('should return "Welcome to dynamic-document!"', () => {
 			const appController = app.get<DynamicDocumentController>(DynamicDocumentController);
 			expect(appController).toBeDefined();
 		});
 	});
 });
diff --git a/acrocharge/apps/services/dynamic-document/src/app/dynamic-document.controller.ts b/acrocharge/apps/services/dynamic-document/src/app/dynamic-document.controller.ts
index f101d7eff3..70453aea73 100644
--- a/acrocharge/apps/services/dynamic-document/src/app/dynamic-document.controller.ts
+++ b/acrocharge/apps/services/dynamic-document/src/app/dynamic-document.controller.ts
@@ -1,13 +1,93 @@
-import { Controller, Get } from '@nestjs/common';
-
+import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
 import { DynamicDocumentService } from './dynamic-document.service';
+import { ApiBearerAuth, ApiNoContentResponse, ApiOkResponse } from '@nestjs/swagger';
+import { AllowedRoles, RequestWithUser, RolesGuard } from '@ac/nest-common';
+import { Roles } from '@ac/auth-types';
+import { AuthGuard } from '@nestjs/passport';
+import { DynamicDocumentDto } from '@ac/dynamic-document/types';
+import { Response } from 'express';

-@Controller()
+@Controller('dynamic-document')
+@ApiBearerAuth()
+@AllowedRoles(Roles.DEVELOPER, Roles.PRODUCT, Roles.RESEARCH_TEAM_LEAD, Roles.RESEARCH)
+@UseGuards(AuthGuard('jwt'), RolesGuard)
 export class DynamicDocumentController {
-	constructor(private readonly appService: DynamicDocumentService) {}
+	constructor(private readonly dynamicDocumentService: DynamicDocumentService) {}
+
+	@ApiOkResponse({
+		type: DynamicDocumentDto,
+	})
+	@ApiNoContentResponse({
+		description: 'No active document matching the given reason group was found.',
+	})
+	@Get('reason-group/:reasonGroupId')
+	async getActiveDynamicDocumentByReasonGroupId(
+		@Param('reasonGroupId') reasonGroupId: string,
+		@Res({ passthrough: true }) res: Response,
+	) {
+		const activeDynamicDoc = this.dynamicDocumentService.getActiveDynamicDocumentByReasonGroupId(reasonGroupId);
+
+		if (activeDynamicDoc) {
+			return activeDynamicDoc;
+		}
+
+		res.status(HttpStatus.NO_CONTENT);
+		return null;
+	}
+
+	@ApiOkResponse({
+		type: DynamicDocumentDto,
+	})
+	@ApiNoContentResponse({
+		description: 'No draft document matching the given reason group was found.',
+	})
+	@Get('draft/:reasonGroupId')
+	async getLatestDynamicDocumentByReasonGroupId(
+		@Param('reasonGroupId') reasonGroupId: string,
+		@Res({ passthrough: true }) res: Response,
+	) {
+		const draftDocument = this.dynamicDocumentService.getLatestDraftDynamicDocument(reasonGroupId);
+
+		if (draftDocument) {
+			return draftDocument;
+		}

-	@Get()
-	getData() {
+		res.status(HttpStatus.NO_CONTENT);
 		return null;
 	}
+
+	@ApiOkResponse({
+		type: DynamicDocumentDto,
+	})
+	@Post('draft')
+	async createDynamicDocumentDraft(@Body() dynamicDocumentDto: DynamicDocumentDto, @Req() { user }: RequestWithUser) {
+		const dynamicDocument = { ...dynamicDocumentDto, updatedBy: user?.userId };
+		return this.dynamicDocumentService.createDynamicDocumentDraft(dynamicDocument);
+	}
+
+	@ApiOkResponse({
+		type: DynamicDocumentDto,
+	})
+	@Post('version')
+	async publishDynamicDocumentVersion(
+		@Body() dynamicDocumentDto: DynamicDocumentDto,
+		@Req() { user }: RequestWithUser,
+	) {
+		const dynamicDocument = { ...dynamicDocumentDto, isDraft: false, isActive: true, updatedBy: user?.userId };
+		return this.dynamicDocumentService.publishDynamicDocument(dynamicDocument);
+	}
+
+	@ApiOkResponse({
+		type: DynamicDocumentDto,
+	})
+	@Post('reason-group/:reasonGroupId')
+	async createDynamicDocument(@Param('reasonGroupId') reasonGroupId: string) {
+		return this.dynamicDocumentService.createDynamicDocument(reasonGroupId);
+	}
+
+	@Delete('delete/:dynamicDocumentUuid')
+	async deleteDraftsByDynamicDocumentUuid(@Param('dynamicDocumentUuid') dynamicDocumentUuid: string) {
+		await this.dynamicDocumentService.deleteDraftsByDynamicDocumentUuid(dynamicDocumentUuid);
+		return HttpStatus.OK;
+	}
 }




