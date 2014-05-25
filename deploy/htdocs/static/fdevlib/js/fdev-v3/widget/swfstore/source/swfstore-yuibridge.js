/*
Copyright (c) 2010, FDEV! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.FDEV.com/yui/license.html
version: 2.8.1
*/
/**
 * The Storage module manages client-side data storage.
 * @module Storage
 */

/*
 * SWF limitation:
 *  - only 100,000 bytes of data may be stored this way
 *  - data is publicly available on user machine
 *
 * Thoughts:
 *  - data can be shared across browsers
 *  - how can we not use cookies to handle session location
 */
(function() {
    // internal shorthand
    var Y = FYU,
    YL = FDEV.lang,
    YD = Y.Dom,

    /*
    * The minimum width required to be able to display the settings panel within the SWF.
    */
    MINIMUM_WIDTH = 215,

    /*
    * The minimum height required to be able to display the settings panel within the SWF.
    */
    MINIMUM_HEIGHT = 138,

    // local variables
    _engine = null,

    /*
    * Creates a location bound key.
    */
    _getKey = function(that, key) {
        return that._location + that.DELIMITER + key;
    },

    /*
    * Initializes the engine, if it isn't already initialized.
    */
    _initEngine = function(cfg) {
        if (!_engine) {
            FD.SWFStore.init(cfg);
            _engine = FD.SWFStore;
        }
    };

    /**
    * The StorageEngineFDSWF class implements the SWF storage engine.
    * @namespace FDEV.util
    * @class StorageEngineFDSWF
    * @uses FDEV.widget.SWF
    * @constructor
    * @extend FDEV.util.Storage
    * @param location {String} Required. The storage location.
    * @param conf {Object} Required. A configuration object.
    */
    Y.StorageEngineFDSWF = function(location, conf) {
        var _this = this;
        Y.StorageEngineFDSWF.superclass.constructor.call(_this, location, Y.StorageEngineFDSWF.ENGINE_NAME, conf);

        _initEngine(_this._cfg);

        // evaluates when the SWF is loaded
        _engine.Event.unsubscribe('engineReady'); // prevents local and session content ready callbacks from firing, when switching between context
        _engine.on('engineReady', function() {
            _this._updateLen();
            _this.fireEvent(_this.CE_READY);
        });

        //update length
        _engine.on('dataChange', function() {
            _this._updateLen();
        })

    };

    YL.extend(Y.StorageEngineFDSWF, Y.Storage, {

        /**
        * 更新长度
        */
        _updateLen: function() {
            this.length = this._getLength();
        },

        /*
        * Implementation to clear the values from the storage engine.
        * @see FDEV.util.Storage._clear
        */
        _clear: function() {
            //TODO: add clear function at engine level
            _engine.clear();
        },

        /*
        * Implementation to fetch an item from the storage engine.
        * @see FDEV.util.Storage._getItem
        */
        _getItem: function(key) {
            return _engine.getItem(_getKey(this, key));
        },

        /*
        * Implementation to fetch a key from the storage engine.
        * @see FDEV.util.Storage.key
        */
        _key: function(index) {
            //that._location + that.DELIMITER + key
            var k = _engine.key(index);
            if (k) {
                k = k.replace(this._location + this.DELIMITER, '');
            }
            return k;
        },

        /*
        * Implementation to remove an item from the storage engine.
        * @see FDEV.util.Storage._removeItem
        */
        _removeItem: function(key) {
            var _key = _getKey(this, key);
            _engine.removeItem(_key);
        },

        /*
        * Implementation to remove an item from the storage engine.
        * @see FDEV.util.Storage._setItem
        */
        _setItem: function(key, data) {
            var _key = _getKey(this, key), swfNode;

            // setting the value returns false if the value didn't change,
            // so I changed this to clear the key if it exists so that the
            // fork below works.
            if (this._getItem(key)) {
                this._removeItem(key);
            }

            if (_engine.setItem(_key, data)) {
                return true;
            } else {
                //set item failed
                return false;
            }
        },

        /**
        * 返回数据项总数
        */
        _getLength: function() {
            return _engine.getLength();
        }
    });


    Y.StorageEngineFDSWF.ENGINE_NAME = 'fdswf';
    Y.StorageEngineFDSWF.isAvailable = function() {
        return FD.SWFStore.isAvailable();
    };
    Y.StorageManager.register(Y.StorageEngineFDSWF);


})();
