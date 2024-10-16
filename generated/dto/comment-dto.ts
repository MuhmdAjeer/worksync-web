/* tslint:disable */
/* eslint-disable */
/**
 * Auth API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


// May contain unused imports in some cases
// @ts-ignore
import { IssueDto } from './issue-dto';
// May contain unused imports in some cases
// @ts-ignore
import { UserDto } from './user-dto';

/**
 * 
 * @export
 * @interface CommentDto
 */
export interface CommentDto {
    /**
     * 
     * @type {string}
     * @memberof CommentDto
     */
    'id': string;
    /**
     * 
     * @type {Date}
     * @memberof CommentDto
     */
    'created_at'?: Date;
    /**
     * 
     * @type {Date}
     * @memberof CommentDto
     */
    'updated_at'?: Date;
    /**
     * 
     * @type {Date}
     * @memberof CommentDto
     */
    'deleted_at'?: Date | null;
    /**
     * 
     * @type {number}
     * @memberof CommentDto
     */
    'version': number;
    /**
     * 
     * @type {string}
     * @memberof CommentDto
     */
    'content': string;
    /**
     * 
     * @type {UserDto}
     * @memberof CommentDto
     */
    'user': UserDto;
    /**
     * 
     * @type {IssueDto}
     * @memberof CommentDto
     */
    'issue': IssueDto;
}

