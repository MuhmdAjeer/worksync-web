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
 * @interface CreateIssueDto
 */
export interface CreateIssueDto {
    /**
     * 
     * @type {string}
     * @memberof CreateIssueDto
     */
    'title': string;
    /**
     * 
     * @type {string}
     * @memberof CreateIssueDto
     */
    'description'?: string;
    /**
     * 
     * @type {string}
     * @memberof CreateIssueDto
     */
    'priority'?: PriorityEnum;
    /**
     * 
     * @type {string}
     * @memberof CreateIssueDto
     */
    'state'?: string;
    /**
     * 
     * @type {Array<string>}
     * @memberof CreateIssueDto
     */
    'assignees_id'?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof CreateIssueDto
     */
    'label_ids'?: Array<string>;
    /**
     * 
     * @type {Date}
     * @memberof CreateIssueDto
     */
    'start_date'?: Date;
    /**
     * 
     * @type {Date}
     * @memberof CreateIssueDto
     */
    'end_date'?: Date;
}

/**
    * @export
    * @enum {string}
    */
export enum PriorityEnum {
    Urgent = 'Urgent',
    High = 'High',
    Medium = 'Medium',
    Low = 'Low',
    None = 'None'
}


