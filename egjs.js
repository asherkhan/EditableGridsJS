var egjs = {
    newRowIndex: AbleBridge.DataGrid.NewRowIndex,
    getField: function (fieldName, rowIndex, formatValue) {
        if (typeof formatValue == 'undefined') {
            formatValue = false;
        }
        if (this.fieldExists(fieldName)) {
            AbleBridge.DataGrid.GetFieldValue(fieldName, rowIndex, !formatValue);
        } else {
            return null;
        }
    },
    setField: function (fieldName, value, rowIndex, fireEvents) {
        if (typeof fireEvents == 'undefined') {
            fireEvents = false;
        }
        if (this.fieldExists(fieldName)) {
            AbleBridge.DataGrid.SetFieldValue(fieldName, value, rowIndex, fireEvents);
        } else {
            console.error(fieldName + 'does not exist on this datagrid.');
        }
    },
    setLookup: function (fieldName, id, name, entityName, rowIndex, fireEvents) {
        var obj = {
            Id: id,
            Name: name,
            LogicalName: entityName
        };
        this.SetFieldValue(fieldName, obj, rowIndex, fireEvents);
    },
    fieldExists: function (fieldName) {
        try {
            AbleBridge.DataGrid.GetFieldValue(fieldName, rowIndex, true);
            return true;
        } catch (e) {
            return false;
        }
    },
    enableField: function (fieldName, rowIndex) {
        AbleBridge.DataGrid.EnableCell(rowIndex, fieldName);
    },
    disableField: function (fieldName, rowIndex) {
        AbleBridge.DataGrid.DisableCell(rowIndex, fieldName);
    },
    makeFieldMandatory: function (fieldName, rowIndex) {
        AbleBridge.DataGrid.SetFieldRequired(fieldName, rowIndex, true);
    },
    makeFieldOptional: function (fieldName, rowIndex) {
        AbleBridge.DataGrid.SetFieldRequired(fieldName, rowIndex, false);
    },
    getSelectedRowIndexes: function () {
        var rows = AbleBridge.DataGrid.GetSelectedRows();
        return rows.map(function (r) { return r.RowIndex; });
    },
    getEditedRowIndexes: function () {
        var rows = AbleBridge.DataGrid.GetEditRows();
        return rows.map(function (r) { return r.RowIndex; });
    },
    getFormId: function () {
        return AbleBridge.DataGrid.Globals.GetParentGUID();
    },
    getFilter: function (fieldToBeFiltered, value, operatorOverride) {
        if (typeof operatorOverride == 'undefined') {
            operatorOverride = AbleBridge.DataGrid.FilterOperators.Equals;
        }
        return AbleBridge.DataGrid.GetFilterExpression(fieldToBeFiltered, operatorOverride, value);
    },
    filterLookup: function (fieldName, filter, rowIndex) {
        AbleBridge.DataGrid.FilterLookupControl(rowIndex, fieldName, filter);
    },
    clearFilterLookup: function (fieldName, rowIndex) {
        AbleBridge.DataGrid.FilterLookupControl(rowIndex, fieldName, AbleBridge.DataGrid.GetFilterExpression(null));
    },
    api: {
        get: function (url, callback, error) {
            if (!this.context.loaded) {
                this.context.init();
            }
            var xhr = new XMLHttpRequest();
            xhr.open('GET', this.context.clientUrl + '/api/data/v8.1/' + url);
            xhr.setRequestHeader('Accept', 'application/json');
            xhr.setRequestHeader('Prefer', 'odata.include-annotations=OData.Community.Display.V1.FormattedValue');
            xhr.setRequestHeader('OData-MaxVersion', '4.0');
            xhr.setRequestHeader('OData-Version', '4.0');
            xhr.onload = function () {
                if (xhr.status === 200 || xhr.status === 204) {
                    if (typeof callback == 'function') {
                        try {
                            var result = JSON.parse(xhr.responseText);
                            callback(result);
                        } catch (e) {
                            callback();
                        }
                    }
                } else {
                    console.error(xhr.responseText);
                    if (typeof error == 'function') {
                        error(xhr.responseText);
                    }
                    return;
                }
            };
            xhr.send();
        },
        post: function (url, data, callback, error) {
            if (!this.context.loaded) {
                this.context.init();
            }
            var xhr = new XMLHttpRequest();
            xhr.open('POST', this.context.clientUrl + '/api/data/v8.1/' + url);
            xhr.setRequestHeader('Accept', 'application/json');
            xhr.setRequestHeader('Prefer', 'odata.include-annotations=OData.Community.Display.V1.FormattedValue');
            xhr.setRequestHeader('OData-MaxVersion', '4.0');
            xhr.setRequestHeader('OData-Version', '4.0');
            xhr.onload = function () {
                if (xhr.status === 200 || xhr.status === 204) {
                    if (typeof callback == 'function') {
                        try {
                            var result = JSON.parse(xhr.responseText);
                            callback(result);
                        } catch (e) {
                            callback();
                        }
                    }
                    var result = JSON.parse(xhr.responseText);
                    callback(result);
                } else {
                    console.error(xhr.responseText);
                    if (typeof error == 'function') {
                        error(xhr.responseText);
                    }
                    return;
                }
            };
            xhr.send(data);
        },
        context: {
            loaded: false,
            context: {},
            clientUrl: '',
            init: function () {
                this.context = this.getContext();
                this.clientUrl = this.context.getClientUrl();
                this.loaded = true;
            },
            getContext: function () {
                if (typeof Xrm != 'undefined') {
                    return Xrm.Page.context;
                } else if (typeof parent.Xrm != 'undefined') {
                    return parent.Xrm.Page.context;
                } else if (typeof GetGlobalContext != 'undefined') {
                    return GetGlobalContext();
                } else {
                    throw new Error('Context is not available.');
                }
            }
        }
    }
};