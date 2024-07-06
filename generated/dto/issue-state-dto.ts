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



/**
 * 
 * @export
 * @interface IssueStateDto
 */
export interface IssueStateDto {
    /**
     * 
     * @type {string}
     * @memberof IssueStateDto
     */
    'id': string;
    /**
     * 
     * @type {string}
     * @memberof IssueStateDto
     */
    'created_at'?: string;
    /**
     * 
     * @type {string}
     * @memberof IssueStateDto
     */
    'updated_at'?: string;
    /**
     * 
     * @type {string}
     * @memberof IssueStateDto
     */
    'deleted_at'?: string | null;
    /**
     * 
     * @type {number}
     * @memberof IssueStateDto
     */
    'version': number;
    /**
     * 
     * @type {string}
     * @memberof IssueStateDto
     */
    'group': GroupEnum;
    /**
     * 
     * @type {string}
     * @memberof IssueStateDto
     */
    'name': string;
    /**
     * 
     * @type {string}
     * @memberof IssueStateDto
     */
    'color'?: string;
    /**
     * 
     * @type {string}
     * @memberof IssueStateDto
     */
    'description'?: string;
}

/**
    * @export
    * @enum {string}
    */
export enum GroupEnum {
    Backlog = 'backlog',
    Unstarted = 'unstarted',
    Started = 'started',
    Completed = 'completed',
    Cancelled = 'cancelled'
}


