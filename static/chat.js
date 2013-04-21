// Copyright 2009 FriendFeed
//
// Licensed under the Apache License, Version 2.0 (the "License"); you may
// not use this file except in compliance with the License. You may obtain
// a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

$(document).ready(function() {
    if (!window.console) window.console = {};
    if (!window.console.log) window.console.log = function() {};

    $("#messageform").on("submit", function() {
	newMessage($(this));
	return false;
    });
    $("#messageform").on("keydown", function(e) {
        console.log(e.keyCode);
	if (e.keyCode == 13 && e.ctrlKey) {
            var val = $("#message").val();
            $("#message").val(val + '\n');
	}
        else if (e.keyCode == 13) {
	    newMessage($(this));
	    return false;
	}
    });
    $("#message").select();
    updater.poll();
});

function newMessage(form) {
    var message = form.formToDict();
    var submit_btn = form.find("input[type=submit]");
    submit_btn.prop('disabled', true)
    $.post(url_new_message, message, function(response) {
	updater.showMessage(response);
	if (message.id) {
	    form.parent().remove();
	} else {
	    form.find("input[type=text]").val("").select();
            submit_btn.prop('disabled', false)
	}
        $("#message").val('');
    })
    .fail(function(response) {
        window.location.replace(url_failed_authorization); //'/chats3');
    });
}

jQuery.fn.formToDict = function() {
    var fields = this.serializeArray();
    var json = {}
    for (var i = 0; i < fields.length; i++) {
	json[fields[i].name] = fields[i].value;
    }
    if (json.next) delete json.next;
    return json;
};

var updater = {
    errorSleepTime: 500,
    cursor: null,

    poll: function() {
	var args = {};
	if (updater.cursor) args.cursor = updater.cursor;
	$.post(url_update_messages,
                $.param(args), updater.onSuccess
                ).fail(updater.onError);
    },

    onSuccess: function(response) {
	try {
	    updater.newMessages(response);
	} catch (e) {
	    updater.onError();
	    return;
	}
	updater.errorSleepTime = 500;
	window.setTimeout(updater.poll, 0);
    },

    onError: function(response) {
	updater.errorSleepTime *= 2;
	console.log("Poll error; sleeping for", updater.errorSleepTime, "ms");
	window.setTimeout(updater.poll, updater.errorSleepTime);
    },

    newMessages: function(response) {
	if (!response.messages) return;
	updater.cursor = response.cursor;
	var messages = response.messages;
	updater.cursor = messages[messages.length - 1].id;
	console.log(messages.length, "new messages, cursor:", updater.cursor);
	for (var i = 0; i < messages.length; i++) {
	    updater.showMessage(messages[i]);
	}
    },

    showMessage: function(message) {
	var existing = $("#m" + message.id);
	if (existing.length > 0) return;
	var node = $(message.me_html);
	node.hide();
	$("#inbox").append(node);
	node.slideDown();
    }
};
