"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var events_1 = require("events");
var ws_1 = __importDefault(require("ws"));
function mixin(obj1, obj2) {
    for (var i in obj2) {
        if (obj2.hasOwnProperty(i)) {
            obj1[i] = obj2[i];
        }
    }
}
;
var Client = /** @class */ (function (_super) {
    __extends(Client, _super);
    function Client(uri) {
        var _this = _super.call(this, uri) || this;
        _this.uri = uri;
        _this.ws = undefined;
        _this.serverTimeOffset = 0;
        _this.user = undefined;
        _this.participantId = undefined;
        _this.channel = undefined;
        _this.ppl = {};
        _this.connectionTime = undefined;
        _this.connectionAttempts = 0;
        _this.desiredChannelId = undefined;
        _this.desiredChannelSettings = undefined;
        _this.pingInterval = undefined;
        _this.canConnect = false;
        _this.noteBuffer = [];
        _this.noteBufferTime = 0;
        _this.noteFlushInterval = undefined;
        _this['🐈'] = 0;
        _this.offlineParticipant = {
            _id: "",
            name: "",
            color: "#777",
            id: ""
        };
        _this.bindEventListeners();
        return _this;
    }
    Client.prototype.bindEventListeners = function () {
        var self = this;
        this.on("hi", function (msg) {
            self.user = msg.u;
            self.receiveServerTime(msg.t, msg.e || undefined);
            if (self.desiredChannelId) {
                self.setChannel();
            }
        });
        this.on("t", function (msg) {
            self.receiveServerTime(msg.t, msg.e || undefined);
        });
        this.on("ch", function (msg) {
            self.desiredChannelId = msg.ch._id;
            self.desiredChannelSettings = msg.ch.settings;
            self.channel = msg.ch;
            if (msg.p)
                self.participantId = msg.p;
            self.setParticipants(msg.ppl);
        });
        this.on("p", function (msg) {
            self.participantUpdate(msg);
            self.emit("participant update", self.findParticipantById(msg.id));
        });
        this.on("m", function (msg) {
            if (self.ppl.hasOwnProperty(msg.id)) {
                self.participantUpdate(msg);
            }
        });
        this.on("bye", function (msg) {
            self.removeParticipant(msg.p);
        });
    };
    Client.prototype.findParticipantById = function (id) {
        return this.ppl[id] || this.offlineParticipant;
    };
    ;
    Client.prototype.receiveServerTime = function (time, echo) {
        var self = this;
        var now = Date.now();
        var target = time - now;
        //console.log("Target serverTimeOffset: " + target);
        var duration = 1000;
        var step = 0;
        var steps = 50;
        var step_ms = duration / steps;
        var difference = target - this.serverTimeOffset;
        var inc = difference / steps;
        var iv;
        iv = setInterval(function () {
            self.serverTimeOffset += inc;
            if (++step >= steps) {
                clearInterval(iv);
                //console.log("serverTimeOffset reached: " + self.serverTimeOffset);
                self.serverTimeOffset = target;
            }
        }, step_ms);
        // smoothen
        //this.serverTimeOffset = time - now;			// mostly time zone offset ... also the lags so todo smoothen this
        // not smooth:
        //if(echo) this.serverTimeOffset += echo - now;	// mostly round trip time offset
    };
    Client.prototype.setChannel = function (id, set) {
        this.desiredChannelId = id || this.desiredChannelId || "lobby";
        this.desiredChannelSettings = set || this.desiredChannelSettings || undefined;
        this.sendArray([{ m: "ch", _id: this.desiredChannelId, set: this.desiredChannelSettings }]);
    };
    Client.prototype.sendArray = function (arr) {
        this.send(JSON.stringify(arr));
    };
    Client.prototype.setParticipants = function (ppl) {
        for (var id in this.ppl) {
            if (!this.ppl.hasOwnProperty(id))
                continue;
            var found = false;
            for (var j = 0; j < ppl.length; j++) {
                if (ppl[j].id === id) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                this.removeParticipant(id);
            }
        }
        // update all
        for (var i = 0; i < ppl.length; i++) {
            this.participantUpdate(ppl[i]);
        }
    };
    Client.prototype.send = function (raw) {
        if (this.isConnected())
            this.ws.send(raw);
    };
    Client.prototype.isOwner = function () {
        return this.channel && this.channel.crown && this.channel.crown.participantId === this.participantId;
    }
    Client.prototype.isConnected = function () {
        return this.isSupported() && this.ws && this.ws.readyState === ws_1.default.OPEN;
    };
    Client.prototype.isConnecting = function () {
        return this.isSupported() && this.ws && this.ws.readyState === ws_1.default.CONNECTING;
    };
    Client.prototype.isSupported = function () {
        return true;
    };
    Client.prototype.start = function () {
        this.canConnect = true;
        this.connect();
    };
    Client.prototype.stop = function () {
        this.canConnect = false;
        this.ws.close();
    };
    Client.prototype.connect = function () {
        if (!this.canConnect || !this.isSupported() || this.isConnected() || this.isConnecting())
            return;
        this.emit("status", "Connecting...");
        this.ws = new ws_1.default(this.uri, { origin: "https://www.multiplayerpiano.com" });
        var self = this;
        this.ws.addEventListener("close", function (evt) {
            self.user = undefined;
            self.participantId = undefined;
            self.channel = undefined;
            self.setParticipants([]);
            clearInterval(self.pingInterval);
            clearInterval(self.noteFlushInterval);
            self.emit("disconnect", evt);
            self.emit("status", "Offline mode");
            // reconnect!
            if (self.connectionTime) {
                self.connectionTime = undefined;
                self.connectionAttempts = 0;
            }
            else {
                ++self.connectionAttempts;
            }
            var ms_lut = [50, 2950, 7000, 10000];
            var idx = self.connectionAttempts;
            if (idx >= ms_lut.length)
                idx = ms_lut.length - 1;
            var ms = ms_lut[idx];
            setTimeout(self.connect.bind(self), ms);
        });
        this.ws.addEventListener("error", function (err) {
            self.emit("wserror", err);
            self.ws.close(); // self.ws.emit("close");
        });
        this.ws.addEventListener("open", function (evt) {
            self.connectionTime = Date.now();
            self.sendArray([{ "m": "hi", "🐈": self['🐈']++ || undefined }]);
            self.pingInterval = setInterval(function () {
                self.sendArray([{ m: "t", e: Date.now() }]);
            }, 20000);
            //self.sendArray([{m: "t", e: Date.now()}]);
            self.noteBuffer = [];
            self.noteBufferTime = 0;
            self.noteFlushInterval = setInterval(function () {
                if (self.noteBufferTime && self.noteBuffer.length > 0) {
                    self.sendArray([{ m: "n", t: self.noteBufferTime + self.serverTimeOffset, n: self.noteBuffer }]);
                    self.noteBufferTime = 0;
                    self.noteBuffer = [];
                }
            }, 200);
            self.emit("connect");
            self.emit("status", "Joining channel...");
        });
        this.ws.addEventListener("message", function (evt) {
            var transmission = JSON.parse(evt.data);
            for (var i = 0; i < transmission.length; i++) {
                var msg = transmission[i];
                self.emit(msg.m, msg);
            }
        });
    };
    Client.prototype.removeParticipant = function (id) {
        if (this.ppl.hasOwnProperty(id)) {
            var part = this.ppl[id];
            delete this.ppl[id];
            this.emit("participant removed", part);
            this.emit("count", this.countParticipants());
        }
    };
    Client.prototype.participantUpdate = function (update) {
        var part = this.ppl[update.id] || null;
        if (part === null) {
            part = update;
            this.ppl[part.id] = part;
            this.emit("participant added", part);
            this.emit("count", this.countParticipants());
        }
        else {
            if (update.x)
                part.x = update.x;
            if (update.y)
                part.y = update.y;
            if (update.color)
                part.color = update.color;
            if (update.name)
                part.name = update.name;
        }
    };
    Client.prototype.countParticipants = function () {
        var count = 0;
        for (var i in this.ppl) {
            if (this.ppl.hasOwnProperty(i))
                ++count;
        }
        return count;
    };
    return Client;
}(events_1.EventEmitter));
module.exports = Client;
