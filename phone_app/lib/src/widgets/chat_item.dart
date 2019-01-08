import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../providers/contact_provider.dart';
import '../providers/dark_mode_provider.dart';
import '../routes/view_image.dart';
import '../util/cipher.dart';

class ChatItem extends StatefulWidget {
  final Map<String, dynamic> _message;
  final String _uid;
  final String _sharedKey;

  ChatItem(this._message, this._uid, this._sharedKey);

  @override
  _ChatItemState createState() => _ChatItemState();
}

class _ChatItemState extends State<ChatItem> with TickerProviderStateMixin {
  AnimationController _controller;
  Animation<double> _animation;

  @override
  void initState() {
    super.initState();

    _controller = AnimationController(
      duration: const Duration(milliseconds: 200),
      vsync: this,
    );
    _animation = CurvedAnimation(
      parent: _controller,
      curve: Curves.easeInOut,
    );

    WidgetsBinding.instance.addPostFrameCallback((_) {
      _controller?.forward();
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final themeData = Theme.of(context);
    final mediaQuery = MediaQuery.of(context);
    final darkModeProvider = Provider.of<DarkModeProvider>(context);
    final contactProvider = Provider.of<ContactProvider>(context);

    final isUserSent = widget._uid == widget._message['sender'];
    final text = decrypt(widget._message['text'], widget._sharedKey);
    final time =
        DateTime.fromMillisecondsSinceEpoch(widget._message['timestamp']);

    return Padding(
      padding: const EdgeInsets.only(bottom: 16, top: 8),
      child: Row(
        mainAxisAlignment:
            isUserSent ? MainAxisAlignment.end : MainAxisAlignment.start,
        children: [
          ScaleTransition(
            scale: _animation,
            alignment:
                isUserSent ? Alignment.bottomRight : Alignment.bottomLeft,
            child: Container(
              key: Key(widget._message['uid']),
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              constraints: BoxConstraints(
                maxWidth: mediaQuery.orientation == Orientation.portrait
                    ? 0.8 * mediaQuery.size.width
                    : 0.6 * mediaQuery.size.width,
              ),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.only(
                  topLeft: const Radius.circular(12),
                  topRight: const Radius.circular(12),
                  bottomLeft:
                      isUserSent ? Radius.circular(12) : Radius.circular(0),
                  bottomRight:
                      isUserSent ? Radius.circular(0) : Radius.circular(12),
                ),
                color: isUserSent
                    ? themeData.primaryColor
                    : darkModeProvider.isDarkTheme
                        ? Colors.black
                        : themeData.backgroundColor,
                boxShadow: [
                  BoxShadow(
                    color: isUserSent ? themeData.primaryColor : Colors.black,
                    spreadRadius: 0,
                    blurRadius: 6,
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  widget._message['isMedia'] == true
                      ? Stack(
                          alignment: Alignment.center,
                          children: [
                            CircularProgressIndicator(
                              valueColor: AlwaysStoppedAnimation<Color>(
                                isUserSent ? Colors.tealAccent : null,
                              ),
                            ),
                            GestureDetector(
                              child: Image.network(text),
                              onTap: () {
                                contactProvider.selectImage(text);
                                Navigator.of(context)
                                    .pushNamed(ViewImagePage.routeName);
                              },
                            ),
                          ],
                        )
                      : Text(
                          text,
                          style: TextStyle(
                            color: isUserSent ? Colors.white : null,
                            fontSize: 16,
                          ),
                        ),
                  const SizedBox(height: 4),
                  Text(
                    "${time.hour}:${time.minute.toString().padLeft(2, '0')}",
                    style: TextStyle(
                      color: Colors.grey,
                      fontSize: 12,
                    ),
                  ),
                ],
              ),
            ),
          )
        ],
      ),
    );
  }
}
