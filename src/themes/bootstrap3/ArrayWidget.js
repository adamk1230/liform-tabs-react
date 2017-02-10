import React from 'react'
import renderField from '../../renderField'
import { FieldArray, formValueSelector } from 'redux-form'
import { connect } from 'react-redux'
import _ from 'lodash'
import ChoiceWidget from './ChoiceWidget'

const renderArrayFields = (count, schema, theme, fieldName, remove) => {
    const prefix = fieldName + '.'
    if (count) {
        return _.times(count, (idx) => {
            return (
            <div key={idx}>
                <button className="pull-right btn btn-danger" onClick={(e) => {
                    e.preventDefault()
                    remove(idx)
                }}><span className="glyphicon glyphicon-trash"></span></button>
                {renderField({ ...schema, showLabel : false }, idx.toString(), theme, prefix)}
            </div>
            )
        })
    } else {
        return null
    }
}

const renderInput = field => {
    return (
        <div className="arrayType form-group">
            <legend className="control-label" >{field.label}</legend>
            { renderArrayFields(field.values.length, field.schema.items, field.theme, field.fieldName, (idx) => field.fields.remove(idx)) }
            <button type="button" className="pull-right btn btn-primary" onClick={() => field.fields.push({})}>Add</button>
            <div className="clearfix"/>
        </div>
    )
}

const CollectionWidget = props =>  {
    return (
        <FieldArray
            component={renderInput}
            label={props.label}
            name={props.fieldName}
            fieldName={props.fieldName}
            schema={props.schema}
            values={props.values}
            theme={props.theme}
        />
    )
}


const ArrayWidget = props =>  {
    // Arrays are tricky because they can be multiselects or collections
    if (props.schema.items.hasOwnProperty('enum') && props.schema.hasOwnProperty('uniqueItems') && props.schema.uniqueItems) {
        return ChoiceWidget({ ...props, schema: props.schema.items, multiple: true })
    } else {
        const selector = formValueSelector('form')
        const ConnectedCollectionWidget = connect(
            state => {
                return {
                    values: selector(state, props.fieldName),
                }
            }
        )(CollectionWidget);
        return <ConnectedCollectionWidget {...props}/>
    }
}

ArrayWidget.propTypes = {
    schema: React.PropTypes.object.isRequired,
    fieldName: React.PropTypes.string,
    label: React.PropTypes.string,
    theme: React.PropTypes.object,
}

export default ArrayWidget
