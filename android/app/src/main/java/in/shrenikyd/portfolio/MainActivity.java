package in.shrenikyd.portfolio;

import android.os.Bundle;
import android.view.View;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import com.getcapacitor.BridgeActivity;

/**
 * Keeps the web content clear of the system bars.
 *
 * Android 15 and later force every app edge to edge and ignore attempts to
 * opt out — the StatusBar plugin's `overlaysWebView: false` is documented as
 * "Not available on Android 15+", and this app targets SDK 36. CSS cannot
 * rescue it either: on Android `env(safe-area-inset-*)` reports display
 * cutouts, not system bars, so it stays 0 behind the clock.
 *
 * The result was page text scrolling underneath the status bar. So the insets
 * are applied here instead, as padding on the content view, which leaves the
 * status and navigation bar areas showing the window background — the same
 * ground colour as the site.
 */
public class MainActivity extends BridgeActivity {

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    final View content = findViewById(android.R.id.content);
    ViewCompat.setOnApplyWindowInsetsListener(
      content,
      (view, windowInsets) -> {
        Insets bars = windowInsets.getInsets(
          WindowInsetsCompat.Type.systemBars() | WindowInsetsCompat.Type.displayCutout()
        );
        view.setPadding(bars.left, bars.top, bars.right, bars.bottom);
        return WindowInsetsCompat.CONSUMED;
      }
    );
  }
}
